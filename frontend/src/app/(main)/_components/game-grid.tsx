"use client";

import { Card, CardBody, CardHeader, Image, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { memo } from "react";
import { FetchStatus } from "@/app/(main)/page";
import { GameListItemResponseDto } from "@/types/dto/game/response";
import { isArray } from "@/utils/assertion";

interface GameGridProps {
  games: GameListItemResponseDto[];
  fetchStatus: FetchStatus;
  page: number;
}

const GameGrid: React.FC<GameGridProps> = ({ games, fetchStatus, page }) => {
  const router = useRouter();

  if (fetchStatus === "loading" && page === 1) {
    return (
      <section className="flex flex-1 items-center justify-center">
        <Spinner color="primary" label="Loading..." labelColor="foreground" />
      </section>
    );
  } else if (fetchStatus === "error" && page === 1) {
    return (
      <section className="flex flex-1 items-center justify-center">
        <p className="text-center text-default-500">Error loading games.</p>
      </section>
    );
  } else if (games.length === 0 && fetchStatus === "success") {
    return (
      <section className="flex flex-1 items-center justify-center">
        <p className="text-center text-default-500">No games found.</p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-4">
      {games.map((game) => (
        <Card
          key={game.gameId}
          className="cursor-pointer py-4"
          onPress={() => router.push(`/game/${game.gameId}`)}
          isPressable
        >
          <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
            <p className="text-tiny font-bold uppercase">
              {/* 안전한 tags 처리 */}
              {(game.tags && isArray(game.tags) ? game.tags : [])
                .map((tag) => `#${tag}`)
                .join(" ")}
            </p>
            <small className="text-default-500">{game.creator}</small>
            <h4 className="text-large font-bold">{game.title}</h4>
          </CardHeader>
          <CardBody className="h-full min-h-[150px] w-full items-center justify-center overflow-visible py-2">
            <Image
              alt={game.title}
              src={game.thumbnailUrl}
              className="h-full w-full rounded-xl object-cover"
              classNames={{
                wrapper: "w-full",
              }}
              width={"400"}
              height={"auto"}
            />
          </CardBody>
        </Card>
      ))}
    </section>
  );
};

export default memo(GameGrid);
