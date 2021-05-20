import AWS, { S3 } from "aws-sdk";
import { Dirent, promises as fsPromises } from "fs";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import {
  UploadFolderToPrefix,
  UploadObjectsData,
  UploadObjectsResponse,
} from "../domain/upload";

/**
 * Move S3 object from source bucket and key to destination
 * @param {string} bucket - S3 bucket where the object is stored
 * @param {string} key - S3 key where the object is referenced
 * @param {string} localFilename - S3 destination bucket
 * @returns {string} - The S3 full URL to the file
 */
export const uploadObject = async (
  bucket: string,
  key: string,
  localFilename: string
): Promise<string> => {
  const s3: S3 = new AWS.S3({ apiVersion: "2006-03-01" });

  const fileContent: Buffer = await fsPromises.readFile(localFilename);

  const result: ManagedUpload.SendData = await s3
    .upload({
      Bucket: bucket,
      Key: key,
      Body: fileContent,
    })
    .promise();

  return result.Location;
};

/**
 * Upload list of files to specific objects
 * @param {string} bucket - AWS S3 bucket where the objects will be stored
 * @param {UploadObjectsData[]} objects - List with objects containing local path to be uploaded and S3 key destination
 */
export const uploadObjects = async (
  bucket: string,
  objects: UploadObjectsData[]
): Promise<UploadObjectsResponse> => {
  const uploaded: string[] = [];
  const errors: string[] = [];
  const promises = objects.map((object) =>
    uploadObject(bucket, object.key, object.localFilename)
  );

  // @ts-ignore
  const results: PromiseSettledResult<string>[] = await Promise.allSettled(
    promises
  );

  // @ts-ignore
  results.forEach((result: PromiseSettledResult<string>) => {
    if (result.status === "rejected") {
      errors.push(`${result.reason.code}: ${result.reason.message}`);
    } else {
      uploaded.push(result.value);
    }
  });

  return {
    uploaded,
    errors,
  };
};

/**
 *
 * @param bucket
 * @param prefix
 * @param folder
 * @param searchStr
 */
export const uploadFolderToPrefix = async (
  bucket: string,
  prefix: string,
  folder: string,
  searchStr: string = ".*"
): Promise<UploadFolderToPrefix> => {
  const folderContent: Dirent[] = await fsPromises.readdir(folder, {
    withFileTypes: true,
  });
  const filenames: string[] = folderContent
    .filter((item: Dirent) => item.isFile())
    .map((item: Dirent) => item.name)
    .filter((item: string) => item.match(searchStr));

  return await uploadObjects(
    bucket,
    filenames.map((filename: string) => ({
      key: `${prefix}/${filename}`,
      localFilename: `${folder}/${filename}`,
    }))
  );
};
