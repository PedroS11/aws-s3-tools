import AWS from "aws-sdk";
import { createBucket } from "../create";

describe("create", () => {
  let createBucketSpy: jest.SpyInstance;

  beforeEach(() => {
    createBucketSpy = jest.fn();
    // @ts-ignore
    jest.spyOn(AWS, "S3").mockImplementation(() => ({
      createBucket: createBucketSpy,
    }));
  });

  afterEach(jest.restoreAllMocks);

  it("should download a file to the local disk", async () => {
    createBucketSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });
    await createBucket({
      Bucket: "BucketName",
    });

    expect(createBucketSpy).toBeCalledWith({
      Bucket: "BucketName",
    });
    createBucketSpy;
  });
});
