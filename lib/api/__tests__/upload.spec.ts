import AWS from "aws-sdk";
import { Dirent, promises as fsPromises } from "fs";
import { uploadFolderToPrefix, uploadObject, uploadObjects } from "../upload";
import * as uploadMethods from "../upload";
import { UploadObjectsData, UploadObjectsResponse } from "../..";

describe("upload", () => {
  afterEach(() => jest.restoreAllMocks());

  describe("uploadObject", () => {
    const fileContent: string = "FILE_CONTENT";
    const bufferFileContent: Buffer = Buffer.from(fileContent, "utf8");

    let s3UploadObject: jest.SpyInstance;
    let readFileSpy: jest.SpyInstance;

    beforeEach(() => {
      s3UploadObject = jest.fn();
      readFileSpy = jest.fn();
      // @ts-ignore
      jest.spyOn(AWS, "S3").mockImplementation(() => ({
        upload: s3UploadObject,
      }));

      readFileSpy = jest
        .spyOn(fsPromises, "readFile")
        .mockResolvedValue(bufferFileContent);
    });

    it("should upload a file from the local disk", async () => {
      s3UploadObject.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Location: "FILE_URL" }),
      });
      const response = await uploadObject(
        "BucketName",
        "s3UploadedFile.pdf",
        "uploadFile.pdf"
      );

      expect(s3UploadObject).toBeCalledWith({
        Bucket: "BucketName",
        Key: "s3UploadedFile.pdf",
        Body: bufferFileContent,
      });

      expect(readFileSpy).toBeCalledWith("uploadFile.pdf");

      expect(response).toEqual("FILE_URL");
    });
  });

  describe("uploadObjects", () => {
    let uploadObjectSpy: jest.SpyInstance;

    const objects: UploadObjectsData[] = [
      {
        localFilename: "test.pdf",
        key: "s3Test.pdf",
      },
    ];

    beforeEach(() => {
      uploadObjectSpy = jest.spyOn(uploadMethods, "uploadObject");
    });

    it("should upload an array of files", async () => {
      uploadObjectSpy.mockResolvedValue("FILE_URL");

      const response: UploadObjectsResponse = await uploadObjects(
        "BucketName",
        objects
      );

      expect(uploadObjectSpy).toHaveBeenCalledWith(
        "BucketName",
        objects[0].key,
        objects[0].localFilename
      );
      expect(response.errors.length).toEqual(0);
      expect(response.uploaded[0]).toEqual("FILE_URL");
    });

    it("should return the list of files uploaded and failed", async () => {
      const errorObject: UploadObjectsData[] = [
        ...objects,
        {
          localFilename: "error.pdf",
          key: "s3Error.pdf",
        },
      ];

      uploadObjectSpy
        .mockRejectedValueOnce({
          code: "500",
          message: "An error occurred",
        })
        .mockResolvedValue("FILE_URL");

      const response: UploadObjectsResponse = await uploadObjects(
        "BucketName",
        errorObject
      );

      expect(uploadObjectSpy).toHaveBeenCalledWith(
        "BucketName",
        errorObject[0].key,
        errorObject[0].localFilename
      );
      expect(uploadObjectSpy).toHaveBeenCalledWith(
        "BucketName",
        errorObject[1].key,
        errorObject[1].localFilename
      );
      expect(response.errors[0]).toEqual(`500: An error occurred`);
      expect(response.uploaded[0]).toEqual("FILE_URL");
    });
  });

  describe("uploadFolderToPrefix", () => {
    let uploadObjectsSpy: jest.SpyInstance;
    let readdirSpy: jest.SpyInstance;

    const folderFiles: Dirent[] = [
      // @ts-ignore
      {
        name: "one.pdf",
        isFile: () => true,
      },
      // @ts-ignore
      {
        name: "photosFolder",
        isFile: () => false,
      },
    ];

    beforeEach(() => {
      uploadObjectsSpy = jest.spyOn(uploadMethods, "uploadObjects");
      // @ts-ignore
      readdirSpy = jest
        .spyOn(fsPromises, "readdir")
        .mockResolvedValue(folderFiles);
    });

    it("should upload the folder's files", async () => {
      uploadObjectsSpy.mockResolvedValue({
        errors: [],
        uploaded: ["FILE_URL"],
      });

      const response: UploadObjectsResponse = await uploadFolderToPrefix(
        "BucketName",
        "s3Folder",
        "localFolder"
      );

      expect(readdirSpy).toHaveBeenCalledWith("localFolder", {
        withFileTypes: true,
      });
      expect(uploadObjectsSpy).toHaveBeenCalledWith("BucketName", [
        {
          key: `s3Folder/${folderFiles[0].name}`,
          localFilename: `localFolder/${folderFiles[0].name}`,
        },
      ]);
      expect(response.errors.length).toEqual(0);
      expect(response.uploaded[0]).toEqual("FILE_URL");
    });
  });
});
