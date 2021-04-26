import AWS from "aws-sdk";
import { objectExists } from "../check";

describe("check", () => {
  let headObjectSpy: jest.SpyInstance;

  beforeEach(() => {
    headObjectSpy = jest.fn();
    // @ts-ignore
    jest.spyOn(AWS, "S3").mockImplementation(() => ({
        headObject: headObjectSpy
      }));
  });

  afterEach(() => jest.restoreAllMocks());

  it("should be called with the correct params", async () => {
    headObjectSpy.mockReturnValue({
      promise: jest.fn()
    });
    await objectExists("BucketName", "FileName");

    expect(headObjectSpy).toBeCalledWith({
      Bucket: "BucketName",
      Key: "FileName"
    });
  });

  it("should return true if the file exists", async () => {
    headObjectSpy.mockReturnValue({
      promise: jest.fn()
    });
    expect(await objectExists("BucketName", "FileName")).toBeTruthy();
  });

  it("should return false if the file does not exist", async () => {
    headObjectSpy.mockReturnValue(new Error("FILE NOT FOUND"));
    expect(await objectExists("BucketName", "FileName")).toBeFalsy();
  });
});
