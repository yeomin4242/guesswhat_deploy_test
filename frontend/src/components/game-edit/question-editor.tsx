import { Button, Card, Chip, Image, Input, Tooltip } from "@nextui-org/react";
import { memo, useEffect, useRef, useState } from "react";
import { removeFile, uploadFile } from "@/actions/storage";
import { UploadIcon } from "@/components/icons";
import { title } from "@/styles/primitives";
import { QuestionItemRequestDto } from "@/types/dto/game/request";

type imageType = "question" | "answer";

interface QuestionEditorProps {
  questionIndex: number;
  question: QuestionItemRequestDto;
  updateQuestion: (
    index: number,
    updates: Partial<QuestionItemRequestDto>,
  ) => void;
  removeQuestion: (id: string) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showValidation?: boolean;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  questionIndex,
  question,
  updateQuestion,
  removeQuestion,
  setIsLoading,
  showValidation = false,
}) => {
  const [answer, setAnswer] = useState<string>("");
  const hiddenQuestionFileInput = useRef<HTMLInputElement>(null);
  const hiddenAnswerFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer("");
  }, [questionIndex]);

  const handleClickQuestionUpload = () => {
    hiddenQuestionFileInput.current?.click();
  };

  const handleClickAnswerUpload = () => {
    hiddenAnswerFileInput.current?.click();
  };

  const handleFileChange = async (file: File, type: imageType = "question") => {
    setIsLoading(true);
    try {
      if (type === "question" && question.questionUrl) {
        await removeFile({
          fileUrl: question.questionUrl,
          bucket: "quiz-uploads",
        });
      } else if (type === "answer" && question.answerUrl) {
        await removeFile({
          fileUrl: question.answerUrl,
          bucket: "quiz-uploads",
        });
      }
      const imageUrl = await uploadFile({
        file,
        bucket: "quiz-uploads",
        folder: "temp/question",
      });
      if (type === "question") {
        updateQuestion(questionIndex, {
          questionUrl: imageUrl,
          questionFileName: file.name,
        });
      } else {
        updateQuestion(questionIndex, {
          answerUrl: imageUrl,
          answerFileName: file.name,
        });
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (answer: string) => {
    updateQuestion(questionIndex, {
      answer: question.answer?.filter((a) => a !== answer),
    });
  };

  const handleAddAnswer = () => {
    const str = answer.trim();
    if (str === "" || question.answer?.includes(str)) return;
    updateQuestion(questionIndex, {
      answer: [...(question.answer || []), str],
    });
    setAnswer("");
  };

  return (
    <section className="flex flex-col gap-4">
      {/* <header className="flex flex-col items-start gap-1">
        <h1 className={title()}>Question {questionIndex + 1}</h1>
        <p className="text-sm text-default-500">
          Upload an image and provide answers for this question
        </p>
      </header> */}

      {/* Question Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Question</h2>
        <div className="flex gap-8">
          {/* Left: Question Image */}
          <div className="flex flex-col gap-4">
            <Card
              isPressable
              className={`group h-60 w-60 cursor-pointer transition-all hover:opacity-80 ${
                showValidation && !question.questionUrl
                  ? "border-2 border-dashed border-danger"
                  : "border-2 border-dashed border-gray-300"
              }`}
              onPress={handleClickQuestionUpload}
            >
              {/* Overlay with upload hint */}
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-center text-sm text-white">
                  Click to upload image
                </p>
              </div>
              <div className="relative h-full w-full">
                {question.questionUrl ? (
                  <Image
                    src={question.questionUrl}
                    alt={`Image for Question #${questionIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 p-4">
                    <UploadIcon className="h-8 w-8 text-gray-400" />
                    <p className="text-center text-sm text-gray-500">
                      Click to upload question image
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Question Text */}
          <div className="flex flex-col gap-4">
            <Input
              className="w-[300px]"
              label="Question Image"
              labelPlacement="outside"
              placeholder={
                question.questionFileName
                  ? question.questionUrl.split("/").pop()
                  : "Upload image for question"
              }
              isRequired
              isInvalid={showValidation && !question.questionUrl}
              errorMessage={
                showValidation && !question.questionUrl
                  ? "Question image is required"
                  : undefined
              }
              isReadOnly
            />
            <Input
              className="w-[300px]"
              label={`Question #${questionIndex + 1}`}
              labelPlacement="outside"
              placeholder="Enter a question prompt (optional)"
              value={question.question}
              onChange={(e) =>
                updateQuestion(questionIndex, { question: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Answer Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Answer</h2>
        <div className="flex gap-8">
          {/* Left: Answer Image */}
          <div className="flex flex-col gap-4">
            <Card
              isPressable
              className="group h-60 w-60 cursor-pointer border-2 border-dashed border-gray-300 transition-all hover:opacity-80"
              onPress={handleClickAnswerUpload}
            >
              {/* Overlay with upload hint */}
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-center text-sm text-white">
                  Click to upload image
                </p>
              </div>
              <div className="relative h-full w-full">
                {question.answerUrl ? (
                  <Image
                    src={question.answerUrl}
                    alt={`Image for Answer #${questionIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50 p-4">
                    <UploadIcon className="h-8 w-8 text-gray-400" />
                    <p className="text-center text-sm text-gray-500">
                      Click to upload answer image (optional)
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Answer Text */}
          <div className="flex flex-col gap-4">
            <Input
              className="w-[300px]"
              label="Answer Image"
              labelPlacement="outside"
              placeholder={
                question.answerFileName
                  ? question.answerUrl.split("/").pop()
                  : "Upload image for answer"
              }
              isReadOnly
            />
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Answers</p>
              <Tooltip content="Press Enter or click Add to add multiple answers">
                <span className="cursor-help text-xs text-default-400">
                  (?)
                </span>
              </Tooltip>
            </div>

            <p className="text-xs text-default-400">
              {question.answer?.length || 0}/10 answers added
            </p>

            <div className="flex min-h-[32px] flex-wrap justify-start gap-2">
              {question.answer?.map((answer, index) => (
                <Chip
                  key={`${answer}-${index}`}
                  variant="solid"
                  color="primary"
                  onClose={() => handleClose(answer)}
                >
                  {answer}
                </Chip>
              ))}
            </div>

            <div className="flex items-end gap-4">
              <Input
                className="w-[300px]"
                maxLength={30}
                label="Answer"
                labelPlacement="outside"
                placeholder="Type an answer and press Enter or Add"
                value={answer}
                isRequired={question.answer?.length === 0}
                isInvalid={showValidation && question.answer?.length === 0}
                errorMessage={
                  showValidation && question.answer?.length === 0
                    ? "At least one answer is required"
                    : undefined
                }
                onChange={(e) => setAnswer(e.currentTarget.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleAddAnswer();
                  }
                }}
              />
              <Button color="primary" variant="solid" onPress={handleAddAnswer}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        accept="image/*"
        ref={hiddenQuestionFileInput}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          handleFileChange(file);
        }}
      />
      <input
        type="file"
        accept="image/*"
        ref={hiddenAnswerFileInput}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          handleFileChange(file, "answer");
        }}
      />
    </section>
  );
};

export default memo(QuestionEditor);
