import AWS from 'aws-sdk'
import dotenv from 'dotenv'
dotenv.config()

const s3 = new AWS.S3({
  endpoint: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESSKEY,
  secretAccessKey: process.env.R2_SECEREST_ACCESSKEYID,
  region: "auto",
  signatureVersion: "v4",
});


export default s3
