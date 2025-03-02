import { Button, Chip, Image, Input, Switch } from "@nextui-org/react";
import { FC, memo, useRef, useState } from "react";
import { removeFile, uploadFile } from "@/actions/storage";
import { UploadIcon } from "@/components/icons";
import { title } from "@/styles/primitives";
import { BaseGameFormData } from "@/types/dto/game/form-data";

interface CoverEditorProps {
  formData: BaseGameFormData;
  setFormData: React.Dispatch<React.SetStateAction<BaseGameFormData>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showVisibilityToggle?: boolean;
  showValidation?: boolean;
}

const CoverEditor: FC<CoverEditorProps> = ({
  formData,
  setFormData,
  setIsLoading,
  showVisibilityToggle = false,
  showValidation = false,
}) => {
  const [tag, setTag] = useState<string>("sample");
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClickUpload = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileChange = async (file: File) => {
    setIsLoading(true);
    try {
      if (formData.thumbnailUrl) {
        await removeFile({
          fileUrl: formData.thumbnailUrl,
          bucket: "quiz-uploads",
        });
      }
      const imageUrl = await uploadFile({
        file,
        bucket: "quiz-uploads",
        folder: "temp/thumbnail",
      });
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: imageUrl,
        thumbnailFileName: file.name,
      }));
    } catch (error) {
      console.error("Failed to upload thumbnail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <section className="flex flex-col gap-4">
      {/* <header className="flex flex-col items-start">
        <h1 className={title()}>Create Game</h1>
      </header> */}
      <div className="flex flex-col items-start gap-4">
        {formData.thumbnailUrl && (
          <Image
            src={formData.thumbnailUrl}
            alt="Quiz Thumbnail"
            className="mt-2 h-40 w-40 object-cover"
          />
        )}
        <Input
          className="max-w-[300px]"
          maxLength={30}
          label="Title"
          labelPlacement="outside"
          placeholder="e.g., Guess the Altcoin"
          value={formData.title}
          isRequired
          isInvalid={showValidation && !formData.title}
          errorMessage={
            showValidation && !formData.title ? "Title is required" : undefined
          }
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, title: e.target.value }));
          }}
        />
        <Input
          className="max-w-[300px]"
          maxLength={30}
          label="Description"
          labelPlacement="outside"
          placeholder="Can you identify these cryptocurrencies?"
          value={formData.description}
          isRequired
          isInvalid={showValidation && !formData.description}
          errorMessage={
            showValidation && !formData.description
              ? "Description is required"
              : undefined
          }
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }));
          }}
        />
        <div className="flex min-h-[64px] w-full items-end gap-4">
          <Input
            className="max-w-[300px]"
            maxLength={30}
            label="Tags"
            labelPlacement="outside"
            placeholder="#binance #bitcoin #ethereum"
            value={tag}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTag(e.currentTarget.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              const str = e.currentTarget.value.trim();
              if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
                if (str === "" || formData.tags.includes(str)) return;
                setFormData((prev) => ({
                  ...prev,
                  tags: [...prev.tags, str],
                }));
                setTag("");
                e.currentTarget.value = "";
              }
            }}
          />
          <Button
            color="primary"
            variant="solid"
            onPress={() => {
              const str = tag.trim();
              if (str === "" || formData.tags.includes(str)) return;
              setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, str],
              }));
              setTag("");
            }}
          >
            Add
          </Button>
        </div>
      </div>
      <div className="flex min-h-[32px] justify-start gap-2">
        {formData.tags?.map((tag, index) => (
          <Chip
            key={index + tag}
            variant="solid"
            color="primary"
            onClose={() => handleClose(tag)}
          >
            {tag}
          </Chip>
        ))}
      </div>
      {/* For thumbnailUrl: */}
      <div className="flex min-h-[64px] items-end gap-4">
        <Input
          className="max-w-[300px]"
          label="Cover Image"
          labelPlacement="outside"
          placeholder={
            formData.thumbnailFileName ?? formData.thumbnailUrl.split("/").pop()
          }
          isRequired
          isInvalid={showValidation && !formData.thumbnailUrl}
          errorMessage={
            showValidation && !formData.thumbnailUrl
              ? "Cover image is required"
              : undefined
          }
          isReadOnly
        />
        <Button
          color="primary"
          variant="solid"
          onPress={handleClickUpload}
          startContent={<UploadIcon />}
        >
          Upload Image
        </Button>
        {/* hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={hiddenFileInput}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            handleFileChange(file);
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        {showVisibilityToggle && (
          <Switch
            checked={!!formData.isVisible}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, isVisible: e.target.checked }));
            }}
          >
            Game Visibility
          </Switch>
        )}
      </div>
    </section>
  );
};

export default memo(CoverEditor);
