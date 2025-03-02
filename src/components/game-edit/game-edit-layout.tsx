import { Alert, Button, Spinner } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { removeFile, uploadFile } from "@/actions/storage";
import DragAndDropOverlay from "@/components/common/drag-and-drop-overlay";
import ExpandableContent from "@/components/common/expandable-content";
import { main, title } from "@/styles/primitives";
import { BaseGameFormData } from "@/types/dto/game/form-data";
import { QuestionItemRequestDto } from "@/types/dto/game/request";
import CoverEditor from "./cover-editor";
import QuestionEditor from "./question-editor";
import SlideNavbar from "./slide-navbar";

type gameEditLayoutMode = "create" | "edit";

interface GameEditLayoutProps {
  readonly formData: BaseGameFormData;
  readonly setFormData: React.Dispatch<React.SetStateAction<BaseGameFormData>>;
  readonly isUploading: boolean;
  readonly setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  readonly onSubmit: () => void;
  readonly mode: gameEditLayoutMode;
}

function getValidationErrors(form: BaseGameFormData): string[] {
  const errors: string[] = [];
  if (!form.thumbnailUrl) errors.push("Cover image is missing");
  if (!form.title) errors.push("Title is missing");
  if (!form.description) errors.push("Description is missing");
  if (form.questions.length < 5) errors.push("Minimum 5 questions required");
  form.questions.forEach((q, i) => {
    if (!q.questionUrl) errors.push(`Image for Question ${i + 1} is missing`);
    if (q.answer.length === 0)
      errors.push(`Answer for Question ${i + 1} is missing`);
  });
  return errors;
}

export default function GameEditLayout({
  formData,
  setFormData,
  isUploading,
  setIsUploading,
  onSubmit,
  mode,
}: GameEditLayoutProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [showAlert, setShowAlert] = useState(false);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null); // new ref

  const validationErrors = useMemo(
    () => getValidationErrors(formData),
    [formData],
  );
  const canSubmit = validationErrors.length === 0;

  const resetAlertTimer = () => {
    // new function
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => {
      setShowAlert(false);
    }, 6500);
  };

  const handleSubmit = useCallback(() => {
    if (!canSubmit) {
      setShowAlert(true);
      resetAlertTimer(); // start timer when alert is shown
      return;
    }
    onSubmit();
  }, [canSubmit, onSubmit]);

  const handleAddQuestion = () => {
    setFormData((prev) => {
      return {
        ...prev,
        questions: [
          ...prev.questions,
          {
            questionId: crypto.randomUUID(),
            question: "",
            questionUrl: "",
            answer: [],
            answerUrl: "",
          },
        ],
      };
    });
    setActiveSlideIndex(formData.questions.length + 1);
  };

  const handleRemoveQuestion = (id: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        questions: prev.questions.filter((q) => q.questionId !== id),
      };
    });
    setActiveSlideIndex(activeSlideIndex - 1);
  };

  const handleUpdateQuestion = (
    index: number,
    updates: Partial<QuestionItemRequestDto>,
  ) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], ...updates };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleDropFile = async (file: File) => {
    setIsUploading(true);

    try {
      if (activeSlideIndex === 0) {
        if (formData.thumbnailUrl) {
          await removeFile({
            fileUrl: formData.thumbnailUrl,
            bucket: "quiz-uploads",
          });
        }
        const newUrl = await uploadFile({
          file,
          bucket: "quiz-uploads",
          folder: "temp/thumbnail",
        });
        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: newUrl,
          thumbnailFileName: file.name,
        }));
      } else {
        const qIndex = activeSlideIndex - 1;
        const existingUrl = formData.questions[qIndex]?.questionUrl;
        if (existingUrl) {
          await removeFile({
            fileUrl: existingUrl,
            bucket: "quiz-uploads",
          });
        }
        const newUrl = await uploadFile({
          file,
          bucket: "quiz-uploads",
          folder: "temp/question",
        });
        setFormData((prev) => {
          const newQuestions = [...prev.questions];
          newQuestions[qIndex] = {
            ...newQuestions[qIndex],
            questionUrl: newUrl,
            questionFileName: file.name,
          };
          return { ...prev, questions: newQuestions };
        });
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DragAndDropOverlay onDropFile={handleDropFile}>
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner color="primary" label="Loading..." labelColor="foreground" />
        </div>
      )}
      <main
        className={main({
          padding: "md",
          display: "flex",
          flexDirection: "col",
        })}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex-1">
            {/* Header with Create/Save button */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className={title()}>
                {activeSlideIndex === 0
                  ? "Game Cover"
                  : `Question ${activeSlideIndex}`}
              </h1>
              <Button
                size="md"
                isDisabled={isUploading}
                onPress={handleSubmit}
                color="primary"
              >
                {mode === "create" ? "Create Game" : "Save Changes"}
              </Button>
            </div>

            {/* Content with Remove Question button for questions */}
            <div className="relative">
              {activeSlideIndex === 0 ? (
                <CoverEditor
                  formData={formData}
                  setFormData={setFormData}
                  setIsLoading={setIsUploading}
                  showVisibilityToggle={mode === "edit"}
                  showValidation={showAlert}
                />
              ) : (
                <>
                  <QuestionEditor
                    questionIndex={activeSlideIndex - 1}
                    question={
                      formData.questions[activeSlideIndex - 1] ?? {
                        questionId: crypto.randomUUID(),
                        question: "",
                        questionUrl: "",
                        answer: [],
                        answerUrl: "",
                      }
                    }
                    updateQuestion={handleUpdateQuestion}
                    removeQuestion={handleRemoveQuestion}
                    setIsLoading={setIsUploading}
                    showValidation={showAlert}
                  />
                  <div className="mt-8 flex justify-end">
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() =>
                        handleRemoveQuestion(
                          formData.questions[activeSlideIndex - 1].questionId,
                        )
                      }
                      className="sm:min-w-[200px]"
                    >
                      Remove Question #{activeSlideIndex}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Fixed bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="border-t bg-background px-6 pb-2 pt-6 shadow-lg">
            <SlideNavbar
              activeSlideIndex={activeSlideIndex}
              setActiveSlideIndex={setActiveSlideIndex}
              gameThumbnail={formData.thumbnailUrl}
              questions={formData.questions}
              onAddQuestion={handleAddQuestion}
              validationErrors={validationErrors}
            />
          </div>
        </div>

        {/* Validation Alert */}
        <AnimatePresence>
          {showAlert && (
            <div className="fixed left-1/2 top-8 z-[9999] w-full max-w-xl -translate-x-1/2 px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  variant="flat"
                  color="danger"
                  onClose={() => setShowAlert(false)}
                  classNames={{
                    base: "bg-danger-50 dark:bg-danger-500/20 py-3 shadow-lg",
                  }}
                >
                  <div className="flex w-full flex-col gap-2">
                    <p className="font-medium">
                      Please fix the following errors:
                    </p>
                    <ExpandableContent onToggle={resetAlertTimer}>
                      <ul className="list-inside list-disc">
                        {validationErrors.map((error, index) => (
                          <li key={`${index}-${error}`} className="text-sm">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </ExpandableContent>
                  </div>
                </Alert>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </DragAndDropOverlay>
  );
}
