import AWS, { S3 } from "aws-sdk";
import { CreateBucketRequest } from "aws-sdk/clients/s3";

/**
 * Creates a S3 bucket
 * @param {CreateBucketRequest} config - S3 settings
 * @returns {void}
 */
export const createBucket = async (
  config: CreateBucketRequest
): Promise<void> => {
  const s3: S3 = new AWS.S3({ apiVersion: "2006-03-01" });

  await s3.createBucket({ ...config }).promise();
};
