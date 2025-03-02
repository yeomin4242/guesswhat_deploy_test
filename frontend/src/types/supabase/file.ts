export interface UploadFileProps {
  file: File;
  bucket: string;
  folder?: string;
}

export interface RemoveFileProps {
  fileUrl: string;
  bucket: string;
}
