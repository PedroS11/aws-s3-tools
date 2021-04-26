import AWS, { S3 } from "aws-sdk";
import { ListObjectsV2Output, Object } from "aws-sdk/clients/s3";

/**
 * Retrieve the list of objects from AWS S3 bucket under a given prefix and search string
 * @param {string} bucket - AWS S3 bucket where the objects are stored
 * @param {string} prefix - Prefix where the objects are under
 * @param {string} searchPath - Basic search string to filter out keys on result (uses Javascript regex)
 * @param {number} maxKeys - Max number of keys to have pagination
 * @returns {string[]} - List of keys inside the bucket, under the path, and filtered
 */
export const listObjects = async (bucket: string, prefix: string = "", searchPath: string = "",  maxKeys: number = 100): Promise<string[]> => {
  let continuationToken: string | undefined = undefined;
  let results: string[] = [];
  let response: ListObjectsV2Output;

  do {
    AWS.config.loadFromPath("./config.json");

    const s3: S3 = new AWS.S3({ apiVersion: "2006-03-01" });

    response = await s3.listObjectsV2({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
      ContinuationToken: continuationToken
    }).promise();

    // @ts-ignore
    let batch: string[] = response.Contents.map((item: Object) => item.Key as string)
      .filter((key: string) => !key.endsWith("/"));

    if(searchPath) {
      batch = batch.filter((key: string) => key.match(searchPath));
    }

    // @ts-ignore
    results = [...results, ...batch];
    continuationToken = response.NextContinuationToken;
  }
  while (response.NextContinuationToken !== undefined);

  return results;
};