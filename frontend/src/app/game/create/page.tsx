"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import GameEditLayout from "@/components/game-edit/game-edit-layout";
import { BaseGameFormData } from "@/types/dto/game/form-data";
import { CreateGameRequestDto } from "@/types/dto/game/request";

export default function CreateGamePage() {
  const [formData, setFormData] = useState<BaseGameFormData>({
    thumbnailUrl: "",
    title: "",
    description: "",
    tags: [],
    questions: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setIsUploading(true);

    // POST with "temp" URLs to /api/game/create
    try {
      const res = await fetch("/api/game/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thumbnailUrl: formData.thumbnailUrl, // "temp/thumbnail" URL
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          creatorId: "1", // TODO: Replace this with User ID from JWT / Session
          questions: formData.questions.map((q) => ({
            questionId: q.questionId,
            questionUrl: q.questionUrl, // "temp/question" URL
            question: q.question,
            answer: q.answer,
            answerUrl: q.answerUrl, // "temp/answer" URL
          })),
        } as CreateGameRequestDto),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Create game error:", err);
        // handle error (show user?)
      } else {
        alert("Game created successfully!");
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <GameEditLayout
      formData={formData}
      setFormData={setFormData}
      isUploading={isUploading}
      setIsUploading={setIsUploading}
      onSubmit={handleCreate}
      mode="create"
    />
  );
}
