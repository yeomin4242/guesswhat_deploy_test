"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SettingsIcon } from "@/components/icons";
import { main } from "@/styles/primitives";
import { AllGameListItemResponseDto } from "@/types/dto/game/response";
import { MyGameListItemResponseDto } from "@/types/dto/profile/response";

export default function ProfileAllGamesPage() {
  const router = useRouter();
  const [allGames, setAllGames] = useState<MyGameListItemResponseDto[] | null>(
    null,
  );

  useEffect(() => {
    async function fetchAllGames() {
      const res = await fetch("/api/game/all");
      if (!res.ok) {
        // handle error
        return;
      }
      const data: AllGameListItemResponseDto = await res.json();
      setAllGames(data.games);
    }
    fetchAllGames();
  }, []);

  if (!allGames) {
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

  return (
    <main className={main({ padding: "lg" })}>
      <h1 className="mb-4 text-2xl font-bold">All Games</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {allGames.map((game) => (
          <Card key={game.gameId} className="cursor-pointer py-4" isHoverable>
            <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
              <div className="flex w-full items-center justify-between">
                <div>
                  <p className="text-tiny font-bold uppercase">
                    {(game.tags && Array.isArray(game.tags) ? game.tags : [])
                      .map((tag) => `#${tag}`)
                      .join(" ")}
                  </p>
                  <p className="text-default-500">
                    {game.isVisible ? "Public" : "Private"}
                  </p>
                </div>
                <Button
                  isIconOnly
                  onPress={() =>
                    router.push(`/profile/game/${game.gameId}/edit`)
                  }
                >
                  <SettingsIcon />
                </Button>
              </div>
              <h4 className="text-large font-bold">{game.title}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt={game.title}
                className="rounded-xl object-cover"
                src={game.thumbnailUrl}
                width={300}
                height={200}
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
