# Instructions
This guide assumes you have already [set up an AWS account](http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/AboutAWSAccounts.html) and have the latest version of the [AWS CLI](https://aws.amazon.com/cli/) installed.

### 1. Configure

TL;DR - `npm run config -- --account-id="$(aws sts get-caller-identity --output text --query Account)" --bucket-name="$(aws sts get-caller-identity --output text --query Account)-aws-cta-twitch-backend-code" --region="us-west-2" --function-name="awsCTATwitchBackend"`

Uses `aws sts get-caller-identity --output text --query Account` to get your account ID.

Run `npm run config -- --account-id="<accountId>" --bucket-name="<bucketName>" [--region="<region>" --function-name="<functionName>"]` to configure the example, eg. `npm run config -- --account-id="123456789012" --bucket-name="my-unique-bucket"`. This modifies `package.json`, `simple-proxy-api.yaml` and `cloudformation.yaml` with your account ID, bucket, region and function name (region defaults to `us-east-1` and function name defaults to `AwsServerlessExpressFunction`). If the bucket you specify does not yet exist, the next step will create it for you. This step modifies the existing files in-place; if you wish to make changes to these settings, you will need to modify `package.json`, `simple-proxy-api.yaml` and `cloudformation.yaml` manually.
### 2. Deploy
TL;DR `npm run setup`

Run `npm run setup` (Windows users: `npm run win-setup`) - this installs the node dependencies, creates an S3 bucket (if it does not already exist), packages and deploys your serverless Express application to AWS Lambda, and creates an API Gateway proxy API.
### 3. Get API URL

TL;DR `aws cloudformation describe-stacks --stack-name awsCTATwitchExt --query 'Stacks[0].Outputs[?OutputKey == `ApiUrl`].OutputValue' --output text`

For the AWS Console:

After the setup command completes, open the AWS CloudFormation console https://console.aws.amazon.com/cloudformation/home and switch to the region you specified. Select the `AwsServerlessExpressStack` stack, then click the `ApiUrl` value under the __Outputs__ section - this will open a new page with your running API. The API index lists the resources available in the example Express server (`app.js`), along with example `curl` commands.

### 4. Test Endpoint
`curl https://<api-id>.execute-api.us-west-2.amazonaws.com/prod/ -i`

Response: 
```json
HTTP/1.1 401 Unauthorized
...
{"message":"invalid token"}
```