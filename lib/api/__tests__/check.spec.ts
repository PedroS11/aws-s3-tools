import AWS from "aws-sdk";
import { bucketExists, objectExists } from "../check";

describe("check", () => {
  let headObjectSpy: jest.SpyInstance;
  let headBucketSpy: jest.SpyInstance;

  beforeEach(() => {
    headObjectSpy = jest.fn();
    headBucketSpy = jest.fn();
    // @ts-ignore
    jest.spyOn(AWS, "S3").mockImplementation(() => ({
      headObject: headObjectSpy,
      headBucket: headBucketSpy,
    }));
  });

  afterEach(jest.restoreAllMocks);

  describe("objectExists", () => {
    it("should be called with the correct params", async () => {
      headObjectSpy.mockReturnValue({
        promise: jest.fn(),
      });
      await objectExists("BucketName", "FileName");

      expect(headObjectSpy).toBeCalledWith({
        Bucket: "BucketName",
        Key: "FileName",
      });
    });

    it("should return true if the file exists", async () => {
      headObjectSpy.mockReturnValue({
        promise: jest.fn(),
      });
      expect(await objectExists("BucketName", "FileName")).toBeTruthy();
    });
    it("should return false if the file does not exist", async () => {
      headObjectSpy.mockReturnValue({
        promise: jest.fn().mockRejectedValue({
          statusCode: 404,
          message: "Not Found",
        }),
      });

      expect(await objectExists("BucketName", "FileName")).toBeFalsy();
    });

    it("should throw if an error occurs", async () => {
      headObjectSpy.mockReturnValue({
        promise: jest.fn().mockRejectedValue({
          statusCode: 500,
          message: "Unexpected error",
        }),
      });

      await expect(objectExists("BucketName", "FileName")).rejects.toEqual({
        statusCode: 500,
        message: "Unexpected error",
      });
    });
  });

  describe("bucketExists", () => {
    it("should return true if the bucket exists", async () => {
      headBucketSpy.mockReturnValue({
        promise: jest.fn(),
      });
      expect(await bucketExists("BucketName")).toBeTruthy();
    });

    it("should return false if the bucket does not exist", async () => {
      headBucketSpy.mockReturnValue({
        promise: jest.fn().mockRejectedValue({
          statusCode: 404,
          message: "Not Found",
        }),
      });

      expect(await bucketExists("BucketName")).toBeFalsy();
    });

    it("should throw if an error occurs", async () => {
      headBucketSpy.mockReturnValue({
        promise: jest.fn().mockRejectedValue({
          statusCode: 500,
          message: "Unexpected error",
        }),
      });

      await expect(bucketExists("BucketName")).rejects.toEqual({
        statusCode: 500,
        message: "Unexpected error",
      });
    });
  });
});
