"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SettingsIcon } from "@/components/icons";
import { main, title } from "@/styles/primitives";
import { MyProfileResponseDto } from "@/types/dto/profile/response";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MyProfileResponseDto | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile/me", { cache: "no-store" });
      if (!res.ok) {
        // handle error
        return;
      }
      const data: MyProfileResponseDto = await res.json();
      setProfile(data);
    }
    fetchProfile();
  }, []);

  if (!profile) {
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

  const totalGames = profile.games.length;
  const gameList = profile.games.slice(0, 5);

  const handleShowAll = () => {
    router.push("/profile/game");
  };

  return (
    <main
      className={main({
        padding: "lg",
        display: "flex",
        flexDirection: "col",
        alignItems: "center",
        justifyContent: "start",
      })}
    >
      <div className="flex w-full flex-col items-start justify-center gap-8">
        <h1 className={title()}>My Profile</h1>
        <div className="flex w-full flex-col items-start justify-center gap-4">
          <h2
            className={title({
              size: "sm",
            })}
          >
            User Info
          </h2>
          <p>{profile.email}</p>
        </div>
        <div className="flex w-full flex-col items-start justify-center gap-4">
          <div className="flex w-full justify-between">
            <h2
              className={title({
                size: "sm",
              })}
            >
              My Games
            </h2>
            {totalGames >= 5 && (
              <Button onPress={handleShowAll}>Show All</Button>
            )}
          </div>
          <div className="flex w-full flex-nowrap gap-4 overflow-x-auto p-4">
            {gameList.length ? (
              gameList.map((game) => (
                <div
                  // TODO: key should be unique. replace with actual gameId
                  key={game.gameId + Math.random().toString(36).substring(7)}
                  className="flex flex-col"
                >
                  <Card className="w-[300px] shrink-0" isHoverable>
                    <CardHeader className="flex h-[60px] justify-between">
                      <div>
                        <h3 className="font-semibold">{game.title}</h3>
                      </div>
                      <Button
                        isIconOnly
                        onPress={() =>
                          router.push(`/profile/game/${game.gameId}/edit`)
                        }
                      >
                        <SettingsIcon />
                      </Button>
                    </CardHeader>
                    <CardBody className="flex h-[200px] items-center justify-center overflow-hidden p-0">
                      <Image
                        alt="Card background"
                        className="h-full w-full rounded-none object-cover"
                        src={game.thumbnailUrl}
                      />
                    </CardBody>
                    {/* <p>{game.isVisible ? "Public" : "Private"}</p> */}
                  </Card>
                  {/* Workaround to avoid scrollbar overlapping */}
                  <Spacer y={5} />
                </div>
              ))
            ) : (
              <div className="flex h-48 w-full items-center justify-center">
                <p>No game found. Create one!</p>
                <Button onPress={() => router.push("/profile/game/create")}>
                  Create Game
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
