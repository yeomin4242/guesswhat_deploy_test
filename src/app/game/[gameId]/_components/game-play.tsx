"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { GamePlayDetailResponseDto } from "@/types/dto/game/response";

interface GamePlayProps {
  readonly gameData: GamePlayDetailResponseDto;
  readonly selectedCount: number;
  // readonly onFinished: () => void;
  readonly onRestart: () => void;
}

export default function GamePlay({
  gameData,
  selectedCount,
  // onFinished,
  onRestart,
}: GamePlayProps) {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [guess, setGuess] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const router = useRouter();

  const questions = useMemo(() => {
    if (selectedCount === -1) return gameData.questions;
    return gameData.questions.slice(0, selectedCount);
  }, [selectedCount, gameData.questions]);

  const currentQuestion = questions[questionIndex];

  function handleCheckAnswer() {
    if (!guess.trim()) return;

    const correctAnswers = currentQuestion.answer;
    const userGuess = guess.trim();
    const matched = correctAnswers.includes(userGuess);

    setIsCorrect(matched);
    if (matched) {
      setCorrectCount((prev) => prev + 1);
    }
    setIsAnswered(true);
  }

  function handleNext() {
    setGuess("");
    setIsAnswered(false);
    setIsCorrect(null);

    const nextIndex = questionIndex + 1;
    if (nextIndex >= questions.length) {
      setIsFinished(true);
    } else {
      setQuestionIndex(nextIndex);
    }
  }

  if (isFinished) {
    return (
      <div className="h-full p-4">
        <Card className="p-4">
          <CardBody className="min-h-[400px] min-w-[400px]">
            <h2>
              Result: {correctCount} / {questions.length} correct
            </h2>
          </CardBody>
          <CardFooter>
            <div className="flex w-full flex-col gap-4">
              <Button
                className="w-full"
                color="primary"
                onPress={() => onRestart()}
              >
                Once Again?
              </Button>
              <Button className="w-full" onPress={() => router.push("/")}>
                Go Back
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-lg flex-col items-center py-4 md:px-4">
      <Card className="w-screen p-4 md:w-full">
        <CardBody className="flex flex-col gap-4 rounded-large">
          {!isAnswered ? (
            <>
              <Image
                src={currentQuestion.questionUrl}
                alt={`Question #${questionIndex + 1}`}
                width={480}
                height={"auto"}
                className="h-full max-h-[70vh] w-full rounded-xl object-cover"
                classNames={{
                  wrapper: "h-full w-full min-w-[300px] min-h-[200px]",
                  img: "h-auto max-h-[60vh] object-contain rounded-large",
                  blurredImg:
                    "h-auto max-h-[70vh] w-full object-cover p-4 rounded-large",
                }}
              />
              <p className="text-lg font-bold">{currentQuestion.question}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckAnswer();
                }}
                className="flex w-full flex-col items-center gap-2"
              >
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Type your answer"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="w-full max-w-md"
                  />
                  <Button onPress={handleCheckAnswer}>Submit</Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold">
                  {isCorrect ? `Correct!` : "Incorrect..."}
                </p>
                <p className="text-gray-600">
                  The answer is{" "}
                  {isCorrect ? `${guess}` : currentQuestion.answer[0]}
                </p>
                <Image
                  src={currentQuestion.answerUrl}
                  alt="Answer Image"
                  width={480}
                  height={"auto"}
                  className="h-full max-h-[70vh] w-full rounded-xl object-cover"
                  classNames={{
                    wrapper: "h-full w-full min-w-[300px] min-h-[200px]",
                    img: "h-auto max-h-[60vh] object-contain rounded-large",
                    blurredImg:
                      "h-auto max-h-[70vh] w-full object-cover p-4 rounded-large",
                  }}
                />
              </div>
              <Button onPress={handleNext}>
                {questionIndex + 1 < questions.length
                  ? "Next Quiz"
                  : "Check Result"}
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
