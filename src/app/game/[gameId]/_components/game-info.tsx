import { Image } from "@nextui-org/react";
import { memo } from "react";
import { subtitle, title } from "@/styles/primitives";
import { GamePlayDetailResponseDto } from "@/types/dto/game/response";
import { clsx } from "@/utils/clsx";

interface GameInfoProps {
  gameData: GamePlayDetailResponseDto;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameData }) => {
  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className={clsx([title(), "font-bold"])}>{gameData.title}</h1>
      </header>
      <Image
        src={gameData.thumbnailUrl}
        alt={gameData.title}
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
      <p className={clsx([subtitle(), "md:w-full", "py-2"])}>
        {gameData.description}
      </p>
    </div>
  );
};

export default memo(GameInfo);
