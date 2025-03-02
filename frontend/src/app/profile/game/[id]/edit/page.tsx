"use client";

import { Spinner } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GameEditLayout from "@/components/game-edit/game-edit-layout";
import { main } from "@/styles/primitives";
import { BaseGameFormData } from "@/types/dto/game/form-data";
import { EditGameDetailResponseDto } from "@/types/dto/game/response";

export default function EditGamePage() {
  const [formData, setFormData] = useState<BaseGameFormData | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // const router = useRouter();
  const params = useParams();
  const gameId = params.id;

  useEffect(() => {
    async function fetchGameEditDetail() {
      const res = await fetch(`/api/game/edit?gameId=${gameId}`);
      if (!res.ok) {
        // handle error
        return;
      }
      const data: EditGameDetailResponseDto = await res.json();
      setFormData(data);
    }
    // TODO: Handle error
    fetchGameEditDetail().catch(() =>
      setFormData({
        thumbnailUrl: "",
        title: "",
        description: "",
        tags: [],
        questions: [],
      }),
    );
  }, [gameId]);

  const handleUpdate = async () => {
    if (
      !formData?.thumbnailUrl ||
      !formData?.title ||
      !formData?.description ||
      !formData?.tags.length ||
      !formData?.questions?.length ||
      !formData?.questions?.every(
        (q) => q.questionUrl && q.question && q.answer.length,
      )
    ) {
      alert("Please fill all required fields!");
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch("/api/game/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        // handle error
        return;
      } else {
        alert("Game updated successfully!");
        // router.push("/profile/game/all");
      }
      const { data } = await res.json();
      setFormData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!formData) {
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
        <section className="flex h-full flex-1 items-center justify-center">
          <Spinner color="primary" label="Loading..." labelColor="foreground" />
        </section>
      </main>
    );
  }
  // Error retreiving data
  else if (formData.questions?.length === 0) {
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
        <section className="flex flex-1 items-center justify-center">
          <p className="text-center text-default-500">Error retrieving data.</p>
          <br />
          <p className="text-center text-default-500">
            &nbsp;Please try it again.
          </p>
        </section>
      </main>
    );
  }

  return (
    <GameEditLayout
      formData={formData}
      setFormData={setFormData}
      isUploading={isUploading}
      setIsUploading={setIsUploading}
      onSubmit={handleUpdate}
      mode="edit"
    />
  );
}
