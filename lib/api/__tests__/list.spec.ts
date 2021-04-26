import AWS from "aws-sdk";
import { listObjects } from "../list";

describe("list", () => {
  let listObjectsV2Spy: jest.SpyInstance;

  beforeEach(() => {
    listObjectsV2Spy = jest.fn();
    // @ts-ignore
    jest.spyOn(AWS, "S3").mockImplementation(() => ({
      listObjectsV2: listObjectsV2Spy,
    }));
  });

  afterEach(() => jest.restoreAllMocks());

  it("should be called with the default params", async () => {
    listObjectsV2Spy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Contents: [] }),
    });
    await listObjects("BucketName", "FolderName");

    expect(listObjectsV2Spy).toBeCalledWith({
      Bucket: "BucketName",
      Prefix: "FolderName",
      ContinuationToken: undefined,
      MaxKeys: 100,
    });
  });

  it("should be called with max keys as 10", async () => {
    listObjectsV2Spy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Contents: [] }),
    });
    await listObjects("BucketName", "FolderName", "", 10);

    expect(listObjectsV2Spy).toBeCalledWith({
      Bucket: "BucketName",
      Prefix: "FolderName",
      ContinuationToken: undefined,
      MaxKeys: 10,
    });
  });

  it("should return the list of files in a s3 bucket", async () => {
    listObjectsV2Spy.mockReturnValue({
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Contents: [{ Key: "test.csv" }, { Key: "testFolder/" }],
          NextContinuationToken: "123ijgoiwej",
        })
        .mockResolvedValue({
          Contents: [{ Key: "testFolder/test.txt" }],
          NextContinuationToken: undefined,
        }),
    });
    const result: string[] = await listObjects(
      "BucketName",
      "FolderName",
      "",
      2
    );

    expect(result).toEqual(["test.csv", "testFolder/test.txt"]);
  });

  it("should return the list of files in a s3 bucket that matches a regex", async () => {
    listObjectsV2Spy.mockReturnValue({
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Contents: [{ Key: "test.csv" }, { Key: "testFolder/" }],
          NextContinuationToken: "123ijgoiwej",
        })
        .mockResolvedValue({
          Contents: [{ Key: "testFolder/test.txt" }],
          NextContinuationToken: undefined,
        }),
    });
    const result: string[] = await listObjects("BucketName", "", ".*.txt", 2);

    expect(result).toEqual(["testFolder/test.txt"]);
  });
});
