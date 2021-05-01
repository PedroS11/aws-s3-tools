import AWS from "aws-sdk";
import { downloadObject } from "../download";
import { promises as fsPromises } from "fs";

describe("download", () => {
  let getObjectSpy: jest.SpyInstance;
  let writeFileSpy: jest.SpyInstance;

  beforeEach(() => {
    getObjectSpy = jest.fn();
    writeFileSpy = jest.fn();
    // @ts-ignore
    jest.spyOn(AWS, "S3").mockImplementation(() => ({
      getObject: getObjectSpy,
    }));

    writeFileSpy = jest.spyOn(fsPromises, "writeFile").mockResolvedValue();
  });

  afterEach(() => jest.restoreAllMocks());

  it("should download a file to the local disk", async () => {
    getObjectSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Body: "TestData" }),
    });
    await downloadObject(
      "BucketName",
      "existingFile.pdf",
      "downloadedFile.pdf"
    );

    expect(getObjectSpy).toBeCalledWith({
      Bucket: "BucketName",
      Key: "existingFile.pdf",
    });

    expect(writeFileSpy).toBeCalledWith("downloadedFile.pdf", "TestData");
  });
});
