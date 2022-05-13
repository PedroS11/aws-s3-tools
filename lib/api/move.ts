import AWS, { S3 } from "aws-sdk";
import { deleteObject } from "./delete";

/**
 * Move S3 object from source bucket to destination bucket
 * @param {string} sourceBucket - S3 bucket where the object is stored
 * @param {string} sourceKey - S3 key where the object is referenced
 * @param {string} destinationBucket - S3 destination bucket
 * @param {string} destinationKey - S3 destination key.
 */
export const moveObject = async (
  sourceBucket: string,
  sourceKey: string,
  destinationBucket: string,
  destinationKey: string
): Promise<void> => {
  const s3: S3 = new AWS.S3({ apiVersion: "2006-03-01" });

  await s3
    .copyObject({
      CopySource: `${sourceBucket}/${sourceKey}`,
      Bucket: destinationBucket,
      Key: destinationKey,
    })
    .promise();

  await deleteObject(sourceBucket, sourceKey);
};

/**
 * Move a list of S3 objects from source bucket to destination
 * @param {string} sourceBucket - S3 bucket where the objects are stored
 * @param {string[]} sourceKeys - S3 keys where the objects are referenced
 * @param {string} destinationBucket - S3 destination bucket
 * @param {string[]} destinationKeys - S3 destination keys
 */
export const moveObjects = async (
  sourceBucket: string,
  sourceKeys: string[],
  destinationBucket: string,
  destinationKeys: string[]
): Promise<void> => {
  if (!sourceKeys.length) {
    throw new Error("Key list length must be greater than zero");
  }

  if (sourceKeys.length !== destinationKeys.length) {
    throw new Error("Key lists must have the same length");
  }

  await Promise.all(
    sourceKeys.map((sourceKey: string, index: number) =>
      moveObject(
        sourceBucket,
        sourceKey,
        destinationBucket,
        destinationKeys[index]
      )
    )
  );
};
