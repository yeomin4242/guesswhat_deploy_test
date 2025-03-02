import { extractPathFromUrl, moveFile } from "@/actions/storage";
import { BaseQuestionInfo } from "@/types/dto/game/form-data";
import {
  CreateGameApiRequestDto,
  CreateGameRequestDto,
  UpdateGameRequestDto,
} from "@/types/dto/game/request";

interface GameQuestion
  extends Omit<BaseQuestionInfo, "questionFileName" | "answerFileName"> {}

export function validateGameData(
  data: CreateGameRequestDto | UpdateGameRequestDto | CreateGameApiRequestDto,
): string | null {
  const { thumbnailUrl, title, description, tags, questions } = data;

  if (!thumbnailUrl || !title || !description || !tags || !questions) {
    return "gameId, thumbnailUrl, title, description, tags, isVisible, questions는 모두 입력해야 합니다.";
  }

  // Validate questions
  for (const q of questions) {
    if (
      !q.question ||
      !q.answer ||
      !Array.isArray(q.answer) ||
      q.answer.length === 0 ||
      q.question.trim() === "" ||
      q.answer.some((a: string) => a.trim() === "")
    ) {
      return "questions의 question 필드와 answer 배열은 비어 있을 수 없습니다.";
    }
  }

  return null;
}

export async function moveImageToFinal(
  url: string | null,
  fromFolder: string,
  toFolder: string,
): Promise<string> {
  if (!url) return url || "";

  const path = extractPathFromUrl(url, "quiz-uploads");
  if (!path?.startsWith(`temp/${fromFolder}`)) return url;

  const newPath = path.replace(`temp/${fromFolder}`, `final/${toFolder}`);
  const { error: moveErr } = await moveFile({
    fromPath: path,
    toPath: newPath,
    fromBucket: "quiz-uploads",
  });

  if (moveErr) {
    console.error(`Failed to move ${fromFolder} image:`, moveErr);
    return url;
  }

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/quiz-uploads/${newPath}`;
}

export async function processGameImages(
  thumbnailUrl: string,
  questions: GameQuestion[],
): Promise<{
  finalCoverUrl: string;
  finalQuestions: GameQuestion[];
}> {
  // Move cover image
  const finalCoverUrl = await moveImageToFinal(
    thumbnailUrl,
    "thumbnail",
    "thumbnail",
  );

  // Process questions
  const finalQuestions = await Promise.all(
    questions.map(async (q) => {
      // Move question image
      const finalQUrl = await moveImageToFinal(
        q.questionUrl,
        "question",
        "question",
      );

      // Move answer image if it exists
      const finalAUrl = await moveImageToFinal(
        q.answerUrl,
        "question",
        "question",
      );

      return {
        questionId: q.questionId,
        question: q.question,
        questionUrl: finalQUrl,
        answer: q.answer,
        answerUrl: finalAUrl,
      };
    }),
  );

  return { finalCoverUrl, finalQuestions };
}

export function calculateGameModes(totalQuestions: number): string[] {
  const modes = [];
  for (let i = 10; i <= totalQuestions; i += 10) {
    modes.push(i.toString());
  }
  return modes;
}
