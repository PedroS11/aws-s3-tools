import AWS from "aws-sdk";
import * as deleteMethods from "../delete";
import { moveKeys, moveObject } from "../move";
import * as moveMethods from "../move";

describe("move", () => {
  let s3CopyObjectSpy: jest.SpyInstance;
  let deleteObjectSpy: jest.SpyInstance;

  beforeEach(() => {
    s3CopyObjectSpy = jest.fn();
    // @ts-ignore
    jest.spyOn(AWS, "S3").mockImplementation(() => ({
      copyObject: s3CopyObjectSpy,
    }));

    deleteObjectSpy = jest
      .spyOn(deleteMethods, "deleteObject")
      .mockResolvedValue();
  });

  afterEach(() => jest.restoreAllMocks());

  describe("moveObject", () => {
    const sourceBucket = "SOURCE_BUCKET";
    const sourceKey = "SOURCE_KEY.pdf";
    const destinationBucket = "DESTINATION_BUCKET";
    const destinationKey = "DESTINATION_KEY.pdf";

    it("should move a file in a bucket", async () => {
      s3CopyObjectSpy.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      await moveObject(
        sourceBucket,
        sourceKey,
        destinationBucket,
        destinationKey
      );

      expect(s3CopyObjectSpy).toBeCalledWith({
        CopySource: `${sourceBucket}/${sourceKey}`,
        Bucket: destinationBucket,
        Key: destinationKey,
      });

      expect(deleteObjectSpy).toBeCalledWith(sourceBucket, sourceKey);
    });
  });

  describe("moveKeys", () => {
    const sourceBucket = "SOURCE_BUCKET";
    const sourceKeys = ["SOURCE_KEY.pdf", "SOURCE_KEY_2.pdf"];
    const destinationBucket = "DESTINATION_BUCKET";
    const destinationKeys = ["DESTINATION_KEY.pdf", "DESTINATION_KEY_2.pdf"];

    let moveObjectSpy: jest.SpyInstance;

    beforeEach(() => {
      moveObjectSpy = jest.spyOn(moveMethods, "moveObject").mockResolvedValue();
    });

    it("should throw if no source keys are passed", async () => {
      await expect(
        moveKeys(sourceBucket, [], destinationBucket, destinationKeys)
      ).rejects.toThrow("Key list length must be greater than zero");
    });

    it("should throw if no source keys length is different from destination keys length", async () => {
      await expect(
        moveKeys(
          sourceBucket,
          [sourceKeys[0]],
          destinationBucket,
          destinationKeys
        )
      ).rejects.toThrow("Key lists must have the same length");
    });

    it("should move a list of files in a bucket", async () => {
      s3CopyObjectSpy.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      await moveKeys(
        sourceBucket,
        sourceKeys,
        destinationBucket,
        destinationKeys
      );

      expect(moveObjectSpy).toBeCalledTimes(sourceKeys.length);
      expect(moveObjectSpy).toHaveBeenCalledWith(
        sourceBucket,
        sourceKeys[0],
        destinationBucket,
        destinationKeys[0]
      );
      expect(moveObjectSpy).toHaveBeenCalledWith(
        sourceBucket,
        sourceKeys[1],
        destinationBucket,
        destinationKeys[1]
      );
    });
  });
});
