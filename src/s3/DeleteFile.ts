import AWS from 'aws-sdk';

const DeleteFile = async (key: string) => {
  const s3url = 'https://histories-bucket.s3.eu-central-1.amazonaws.com/';

  // check if env variables are not undefined, otherwise throw error
  if (!process.env.S3_BUCKET) throw new Error('S3 bucket is not defined');
  if (!process.env.S3_ACCESS_KEY)
    throw new Error('S3 access key is not defined');
  if (!process.env.S3_SECRET_ACCESS_KEY)
    throw new Error('S3 secret access key is not defined');

  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key.startsWith(s3url) ? key.substring(s3url.length) : key,
  };

  // delete object from S3
  await s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};

export default DeleteFile;
