<h1 align='center'>
  AWS-S3-Tools
</h1>

![npm](https://img.shields.io/npm/v/aws-s3-tools?color=brightgreen)
![GitHub repo size](https://img.shields.io/github/repo-size/PedroS11/riot-valorant-api)
![GitHub](https://img.shields.io/github/license/PedroS11/riot-valorant-api)

AWS S3 Tools is a NPM package to make it easier to deal with S3 objects,  where you can:
                                                                         
 - List S3 bucket content
 - Check if an S3 object exists
 - Download S3 objects to local files
 - Delete S3 objects
 
 ## Table of Contents
 
 - [Disclaimer](#disclaimer)
 - [Installation](#installation)
 - [Documentation](#documentation)
   * [Check](#check)
   * [List](#list)
   * [Delete](#delete)
   * [Download](#download)
 - [Authentication](#authentication)
 - [Tests](#tests)
 - [Problems or issues?](#problems-or-issues-)
 - [License](#license)

## Disclaimer
 > This project was created based on another developed in Python. If you would like to use this methods
 in Python, visit [this repo](https://github.com/FerrariDG/aws-s3-tools).

## Installation
 The package is available through NPM, which means you can choose to install it using either `npm` or `yarn`
 
 NPM:
 ```sh
 npm install aws-s3-tools
 ```
 
 Yarn:
 ```sh
 yarn add aws-s3-tools
 ```
## Documentation

### Check

- Check if an object exists in a S3 bucket

 ```typescript
const exists: boolean = await objectExists("BucketName", "FileName");
 ```

### List

- List all objects in a S3 bucket (with filter options)

 ```typescript
const keysList: string[] = await listObjects("BucketName", "FolderName");
 ```

### Delete

- Delete an object in a S3 bucket
 ```typescript
await deleteMethods.deleteObject("BucketName", "existingFile.pdf");
```
- Delete all objects under a prefix

 ```typescript
await deleteFromPrefix("BucketName", "folder");
 ```

- Delete all objects in the keys list from S3 bucket
 
 ```typescript
const keys = ["folder/test.pdf", "folder/file.csv"];
await deleteFromKeys("BucketName", keys);
 ```

### Download

- Retrieve one object from AWS S3 bucket and store into local disk

 ```typescript
await downloadObject("BucketName","existingFile.pdf", "downloadedFile.pdf");
 ```
 
 ### Upload
 
- Upload one file from local disk and store into AWS S3 bucket

```typescript
await uploadObject("BucketName","s3file.pdf", "localFile.pdf");
  ```
  
- Upload list of files to specific objects

```typescript
await uploadObjects("BucketName",[{ key: "s3file.pdf", localFilename: "localFile.pdf" }]);
```

- Upload all files for a given folder (just root files) and store them into a S3 bucket under a prefix  (with filter options)

```typescript
await uploadFolderToPrefix("BucketName", "s3Folder", "localFolder");
```
---

The documentation for each method supported by this module can be found [here](https://pedros11.github.io/aws-s3-tools/modules.html).


## Authentication

To use this package, it's necessary to authenticate to AWS, using one of three options:
- Load credentials from a json file

 ```sh
 AWS.config.loadFromPath("./config.json");
 // call methods
 ```
 
 For more information, visit [Authenticate with json file](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html).
 - Load credentials from Shared Credentials file
 
  ```sh
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'work-account'});
  // call methods
  ```
For more information, visit [Authenticate with Shared Credentials file](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html).

 - Load ClientId, ClientSecret and Region directly 
  ```sh
 AWS.config.update({
   accessKeyId: CLIENT_ID,
   secretAccessKey: CLIENT_SECRET,
   region: REGION
 });
 // call methods
  ```
  For more information, visit [Authenticate with Environment Variables](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html).

## Tests

To run the tests for this project:

 NPM:
 ```sh
 npm run test
 ```
 
 Yarn:
 ```sh
 yarn test
 ```
 
 ## Problems or issues?
 
 If you encounter any problems, bugs or other issues with the package, please create an [issue in the GitHub repo](https://github.com/PedroS11/aws-s3-tools/issues). 

## License 

[MIT](https://github.com/PedroS11/aws-s3-tools/blob/main/LICENSE.md)