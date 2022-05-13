import AWS, { S3 } from "aws-sdk";
import { listObjects } from "./list";

/**
 * Retrieve the list of objects from AWS S3 bucket under a given prefix and search string
 * @param {string} bucket - AWS S3 bucket where the objects are stored
 * @param {string} key - Key for the object that will be deleted
 * @returns {string[]} - List of keys inside the bucket, under the path, and filtered
 */
export const deleteObject = async (
  bucket: string,
  key: string
): Promise<void> => {
  const s3: S3 = new AWS.S3({ apiVersion: "2006-03-01" });

  await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
};

/**
 * Delete all objects under the given prefix from S3 bucket
 * @param {string} bucket - AWS S3 bucket where the objects are stored
 * @param {string} prefix - Prefix where the objects are under
 */
export const deleteFromPrefix = async (
  bucket: string,
  prefix: string
): Promise<void> => {
  const keys = await listObjects(bucket, prefix);

  await Promise.all(keys.map((key: string) => deleteObject(bucket, key)));
};

/**
 * Delete all objects in the keys list from S3 bucket
 * @param {string} bucket - AWS S3 bucket where the objects are stored
 * @param {string} keys - List of object keys
 */
export const deleteFromKeys = async (
  bucket: string,
  keys: string[]
): Promise<void> => {
  await Promise.all(keys.map((key: string) => deleteObject(bucket, key)));
};

/**
 * Delete a S3 bucket
 * @param {string} bucket - AWS S3 bucket
 * */
export const deleteBucket = async (bucket: string): Promise<void> => {
  const s3: S3 = new AWS.S3({ apiVersion: "2006-03-01" });

  await s3.deleteBucket({ Bucket: bucket }).promise();
};
