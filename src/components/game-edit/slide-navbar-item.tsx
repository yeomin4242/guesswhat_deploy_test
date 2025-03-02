import { Card, Image } from "@nextui-org/react";
import { memo } from "react";

interface SlideNavbarItemProps {
  label: string;
  thumbnail?: string;
  active: boolean;
  hasError?: boolean;
  onClick: () => void;
}

const SlideNavbarItem: React.FC<SlideNavbarItemProps> = ({
  label,
  thumbnail,
  active,
  hasError,
  onClick,
}) => {
  return (
    <Card
      onPress={onClick}
      className={`relative h-[120px] w-[160px] cursor-pointer rounded ${
        active && !hasError
          ? "border-2 border-blue-500"
          : "border border-gray-300"
      } ${
        hasError
          ? "before:absolute before:inset-[-3px] before:rounded-lg before:border-2 before:border-dashed before:border-danger"
          : ""
      }`}
      classNames={{
        base: "shrink-0 overflow-visible",
      }}
      isPressable
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={label}
          className="h-full w-full rounded object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center" />
      )}
      {/* overlay label */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/60 py-1 text-center text-sm text-white">
        {label}
      </div>
    </Card>
  );
};

export default memo(SlideNavbarItem);
