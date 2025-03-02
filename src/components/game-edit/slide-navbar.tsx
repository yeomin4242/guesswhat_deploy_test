import { Button, Spacer } from "@nextui-org/react";
import { AddCircleIcon } from "@/components/icons";
import { QuestionItemRequestDto } from "@/types/dto/game/request";
import SlideNavbarItem from "./slide-navbar-item";

interface SlideNavbarItemProps {
  activeSlideIndex: number;
  setActiveSlideIndex: (index: number) => void;
  gameThumbnail: string;
  questions: QuestionItemRequestDto[];
  onAddQuestion: () => void;
  validationErrors?: string[];
}

const SlideNavbar: React.FC<SlideNavbarItemProps> = ({
  activeSlideIndex,
  setActiveSlideIndex,
  gameThumbnail,
  questions,
  onAddQuestion,
  validationErrors = [],
}) => {
  const hasCoverError = validationErrors.some(
    (error) =>
      error === "Cover image is required" ||
      error === "Title is required" ||
      error === "Description is required",
  );

  const getQuestionErrors = (index: number) => {
    return validationErrors.some(
      (error) =>
        error === `Question ${index + 1} image is required` ||
        error === `Question ${index + 1} answer is required`,
    );
  };

  return (
    <div className="flex flex-row items-center gap-6 overflow-x-auto pb-4">
      <SlideNavbarItem
        label="Cover"
        thumbnail={gameThumbnail}
        active={activeSlideIndex === 0}
        hasError={hasCoverError}
        onClick={() => setActiveSlideIndex(0)}
      />
      {questions.map((q, idx) => (
        <SlideNavbarItem
          key={q.questionId}
          label={`Q${idx + 1}`}
          thumbnail={q.questionUrl}
          active={activeSlideIndex === idx + 1}
          hasError={getQuestionErrors(idx)}
          onClick={() => setActiveSlideIndex(idx + 1)}
        />
      ))}
      <Button
        onPress={onAddQuestion}
        className="flex h-[120px] min-w-[150px] items-center justify-center rounded border text-center"
      >
        <AddCircleIcon />
      </Button>
    </div>
  );
};

export default SlideNavbar;
