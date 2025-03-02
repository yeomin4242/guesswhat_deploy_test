"use client";

import { Button, Card, CardBody, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { main } from "@/styles/primitives";
import { GamePlayDetailResponseDto } from "@/types/dto/game/response";
import { clsx } from "@/utils/clsx";
import GameInfo from "./_components/game-info";
import GamePlay from "./_components/game-play";
import QuestionCountSelector from "./_components/question-count-selector";

export default function GameDetailPage({
  params,
}: {
  readonly params: Promise<{ gameId: string }>;
}) {
  const { gameId } = use(params);
  const router = useRouter();

  const [gameData, setGameData] = useState<GamePlayDetailResponseDto | null>(
    null,
  );

  const [questionCounts, setQuestionCounts] = useState<number[]>([]);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!gameId) {
      router.push("/");
      return;
    }
    async function fetchData() {
      const res = await fetch(`/api/game/detail?gameId=${gameId}`);
      if (!res.ok) {
        // handle error
        return;
      }
      const data = await res.json();
      setGameData(data);
      const questionCount = data.questions?.length || 0;
      const counts = [10, 20, 30, 40, 50, -1].filter((c) => c <= questionCount);
      setQuestionCounts(counts);
    }
    fetchData();
  }, [gameId, router]);

  const handleSelectCount = useCallback((count: number) => {
    setErrorMessage("");
    setSelectedCount((prev) => (count === prev ? null : count));
  }, []);

  const handleStartGame = () => {
    if (!selectedCount && selectedCount !== -1) {
      setErrorMessage("Choose the number of questions to start the game.");
      return;
    }
    setIsPlaying(true);
  };

  if (!gameData) {
    return (
      <main
        className={main({
          padding: "sm",
          display: "flex",
          flexDirection: "col",
          justifyContent: "center",
        })}
      >
        <Spinner color="primary" label="Loading..." labelColor="foreground" />
      </main>
    );
  }

  const handleRestartGame = () => {
    setIsPlaying(false);
    setSelectedCount(null);
  };

  return (
    <main
      className={clsx([
        main({ padding: "none" }),
        "flex h-full flex-col items-center justify-start",
      ])}
    >
      {!isPlaying ? (
        <Card className="min-h-[calc(100vh_-_64px)] rounded-none p-4 md:min-h-full md:rounded-large">
          <CardBody>
            <GameInfo gameData={gameData} />
            <QuestionCountSelector
              questionCounts={questionCounts}
              selectedCount={selectedCount}
              onSelectCount={handleSelectCount}
              errorMessage={errorMessage}
            />
            <Button color="primary" onPress={handleStartGame} size="lg">
              Start!
            </Button>
          </CardBody>
        </Card>
      ) : (
        <GamePlay
          gameData={gameData}
          selectedCount={selectedCount}
          onRestart={handleRestartGame}
        />
      )}
    </main>
  );
}
