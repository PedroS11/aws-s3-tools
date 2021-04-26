<h1 align='center'>
  AWS-S3-Tools
</h1>

![npm](https://img.shields.io/npm/v/aws-s3-tools?color=brightgreen)
![GitHub repo size](https://img.shields.io/github/repo-size/PedroS11/riot-valorant-api)
![GitHub](https://img.shields.io/github/license/PedroS11/riot-valorant-api)

AWS S3 Tools is a NPM package to make it easier to deal with S3 objects.

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
The full list of methods supported by this module can be found [here](https://pedros11.github.io/aws-s3-tools/index.html).


## Authentication

To use this package, it's necessary to authenticate to AWS, using one of two options:
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