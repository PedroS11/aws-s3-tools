import AWS from "aws-sdk";
import * as deleteMethods from "../delete";
import * as listMethods from "../list";
import { deleteFromKeys, deleteFromPrefix } from "../delete";

describe("delete", () => {
  let s3DeleteObjectSpy: jest.SpyInstance;

  beforeEach(() => {
    s3DeleteObjectSpy = jest.fn();
    // @ts-ignore
    jest.spyOn(AWS, "S3").mockImplementation(() => ({
      deleteObject: s3DeleteObjectSpy,
    }));
  });

  afterEach(() => jest.restoreAllMocks());

  describe("deleteObject", () => {
    it("should delete a file from a s3 bucket", async () => {
      s3DeleteObjectSpy.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      await deleteMethods.deleteObject("BucketName", "existingFile.pdf");

      expect(s3DeleteObjectSpy).toBeCalledWith({
        Bucket: "BucketName",
        Key: "existingFile.pdf",
      });
    });
  });

  describe("deleteFromPrefix", () => {
    let listObjectsSpy: jest.SpyInstance;
    let deleteObjectSpy: jest.SpyInstance;
    beforeEach(() => {
      deleteObjectSpy = jest
        .spyOn(deleteMethods, "deleteObject")
        .mockResolvedValue();
      listObjectsSpy = jest.spyOn(listMethods, "listObjects");
    });
    afterEach(() => jest.restoreAllMocks());

    it("should remove all files under a given prefix", async () => {
      const keys = ["folder/test.pdf", "folder/file.csv"];
      listObjectsSpy.mockResolvedValue(keys);

      await deleteFromPrefix("BucketName", "folder");

      expect(listObjectsSpy).toBeCalledWith("BucketName", "folder");
      expect(deleteObjectSpy).toBeCalledTimes(2);
      expect(deleteObjectSpy).toHaveBeenNthCalledWith(1, "BucketName", keys[0]);
      expect(deleteObjectSpy).toHaveBeenNthCalledWith(2, "BucketName", keys[1]);
    });
  });

  describe("deleteFromPrefix", () => {
    let deleteObjectSpy: jest.SpyInstance;
    beforeEach(() => {
      deleteObjectSpy = jest
        .spyOn(deleteMethods, "deleteObject")
        .mockResolvedValue();
    });

    afterEach(() => jest.restoreAllMocks());

    it("should remove all files under a given prefix", async () => {
      const keys = ["folder/test.pdf", "folder/file.csv"];

      await deleteFromKeys("BucketName", keys);

      expect(deleteObjectSpy).toBeCalledTimes(2);
      expect(deleteObjectSpy).toHaveBeenNthCalledWith(1, "BucketName", keys[0]);
      expect(deleteObjectSpy).toHaveBeenNthCalledWith(2, "BucketName", keys[1]);
    });
  });
});
