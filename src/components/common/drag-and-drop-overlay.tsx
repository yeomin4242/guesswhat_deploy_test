"use client";

import React, { DragEvent, useCallback, useState } from "react";

interface DragAndDropOverlayProps {
  onDropFile: (file: File) => void;
  children: React.ReactNode;
}

const DragAndDropOverlay: React.FC<DragAndDropOverlayProps> = ({
  onDropFile,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newVal = prev + 1;
      if (newVal > 0) {
        setIsDragging(true);
      }
      return newVal;
    });
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newVal = prev - 1;
      if (newVal <= 0) {
        setIsDragging(false);
        return 0;
      }
      return newVal;
    });
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        onDropFile(file);
        e.dataTransfer.clearData();
      }
    },
    [onDropFile],
  );

  return (
    <div
      aria-label="Drag and drop area"
      className="relative h-full w-full"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="text-2xl text-white">Drop image to upload...</div>
        </div>
      )}
    </div>
  );
};

export default DragAndDropOverlay;
