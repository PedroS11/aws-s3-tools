export interface UploadObjectsData {
  key: string;
  localFilename: string;
}

export interface UploadObjectsResponse {
  uploaded: string[];
  errors: string[];
}

export type UploadFolderToPrefix = UploadObjectsResponse;
