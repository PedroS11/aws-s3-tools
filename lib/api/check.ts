import AWS, { S3 } from "aws-sdk";

/**
 * Check if an object exists for a given bucket and key
 * @param {string} bucket - Bucket name where the object is stored
 * @param {string} key - Full key for the object
 * @returns {boolean} - true if the object exists, otherwise false
 */
export const objectExists = async (
  bucket: string,
  key: string
): Promise<boolean> => {
  try {
    const s3: S3 = new AWS.S3({ apiVersion: "2006-03-01" });

    await s3.headObject({ Bucket: bucket, Key: key }).promise();
  } catch (error) {
    if (error.statusCode === 404) {
      return false;
    }
    throw error;
  }
  return true;
};
