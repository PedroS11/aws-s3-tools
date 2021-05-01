import AWS, { S3 } from "aws-sdk";
import { GetObjectOutput } from "aws-sdk/clients/s3";
import { promises as fsPromises } from "fs";

/**
 * Retrieve one object from AWS S3 bucket and store into local disk
 * @param {string} bucket - Bucket name where the object is stored
 * @param {string} key - Full key for the object
 * @param {string} localFilename - Local file where the data will be downloaded to
 * @returns {void}
 */
export const downloadObject = async (
  bucket: string,
  key: string,
  localFilename: string
): Promise<void> => {
  const s3: S3 = new AWS.S3({ apiVersion: "2006-03-01" });

  const response: GetObjectOutput = await s3
    .getObject({ Bucket: bucket, Key: key })
    .promise();
  // @ts-ignore
  await fsPromises.writeFile(localFilename, response.Body);
};
