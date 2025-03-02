import { createClient } from "@supabase/supabase-js";
import { v4 } from "uuid";
import { createBrowserSupabaseClient } from "@/libs/supabase-client";
import { RemoveFileProps, UploadFileProps } from "@/types/supabase/file";

function getStorageFromClient() {
  const { storage } = createBrowserSupabaseClient();
  return storage;
}

// NOTE: 사실 FromServer 는 아닌듯?
function getStorageFromServer() {
  const { storage } = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return storage;
}

export function getStorage() {
  if (typeof window === "undefined") {
    return getStorageFromServer();
  } else {
    return getStorageFromClient();
  }
}

export async function uploadFile({ file, bucket, folder }: UploadFileProps) {
  const fileName = file.name;
  const fileExtension = fileName.split(".").pop();
  const path = `${folder ? `${folder}/` : ""}${v4()}.${fileExtension}`;
  const storage = getStorage();

  const { data, error } = await storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data?.path}`;

  return imageUrl;
}

// helper to parse the path from a public URL
function extractStoragePath(fileUrl: string, bucket: string) {
  // e.g. fileUrl = https://xyz.supabase.co/storage/v1/object/public/quiz-uploads/folder/uuid.png
  // we want everything after `/public/${bucket}/`
  const idx = fileUrl.indexOf(`/storage/v1/object/public/${bucket}/`);
  if (idx < 0) return null;

  // e.g. => "/storage/v1/object/public/quiz-uploads/folder/uuid.png"
  const substring = fileUrl.substring(idx);
  // remove the initial part "/storage/v1/object/public/quiz-uploads/"
  // note: you'll parse out "folder/uuid.png"
  const prefix = `/storage/v1/object/public/${bucket}/`;
  const path = substring.replace(prefix, "");
  return path;
}

export async function removeFile({ fileUrl, bucket }: RemoveFileProps) {
  const storagePath = extractStoragePath(fileUrl, bucket);
  if (!storagePath) return; // or throw an error if you want
  const storage = getStorage();

  const { error } = await storage.from(bucket).remove([storagePath]);

  if (error) {
    console.error("Error removing file:", error);
  }
}

// TODO: later, if we have mulitple buckets, we can add a helper to get the bucket from the URL
// async function removeFileFromSupabase(prevUrl: string) {
//   const bucket = getBucketFromUrl(prevUrl);
//   await removeFile({ fileUrl: prevUrl, bucket: "quiz-uploads" });
// }

/**
 * @description Moves a file within (or across) buckets in Supabase Storage.
 * @param {string} fromPath e.g. "temp/thumbnail/uuid.png"
 * @param {string} toPath   e.g. "final/thumbnail/uuid.png"
 * @param {string} fromBucket The source bucket name
 * @param {string} toBucket   Optional different bucket if you want cross-bucket move
 */
export async function moveFile({
  fromPath,
  toPath,
  fromBucket,
  toBucket,
}: {
  fromPath: string;
  toPath: string;
  fromBucket: string;
  toBucket?: string;
}): Promise<{ data: any; error: any }> {
  const bucket = toBucket || fromBucket;
  const storage = getStorage();

  const { data, error } = await storage
    .from(fromBucket)
    .move(fromPath, toPath, {
      destinationBucket: bucket,
    });

  return { data, error };
}

/**
 * Extracts the path part from a public URL in the "quiz-uploads" bucket
 */
export function extractPathFromUrl(
  fileUrl: string,
  bucket: string,
): string | null {
  // your existing code
  const idx = fileUrl.indexOf(`/storage/v1/object/public/${bucket}/`);
  if (idx < 0) return null;
  const prefix = `/storage/v1/object/public/${bucket}/`;
  return fileUrl.substring(idx + prefix.length);
}
