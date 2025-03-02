import { Button } from "@nextui-org/react";
import { clsx } from "@/utils/clsx";

interface QuestionCountSelectorProps {
  questionCounts: number[];
  selectedCount: number | null;
  onSelectCount: (count: number) => void;
  errorMessage: string;
}

const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({
  questionCounts,
  selectedCount,
  onSelectCount,
  errorMessage,
}) => {
  return (
    <div className="mb-6 flex flex-col items-center justify-center gap-4">
      <span className="text-gray-400">
        {questionCounts.length !== 0 ? "Number of Quiz" : ""}
      </span>
      <div className="flex items-center">
        {questionCounts.map((count) => (
          <Button
            key={count}
            size="sm"
            variant={count === selectedCount ? "solid" : "flat"}
            onPress={() => onSelectCount(count)}
            className={clsx([
              "mx-1 px-4 py-2",
              count === selectedCount && "bg-pink-600 text-white",
            ])}
          >
            {count < 0 ? "All" : `${count}개`}
          </Button>
        ))}
      </div>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default QuestionCountSelector;
