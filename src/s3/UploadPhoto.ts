import AWS from 'aws-sdk';
import sharp from 'sharp';
import streamToPromise from 'stream-to-promise';
import crypto from 'crypto';
import { encode } from 'blurhash';

const UploadPhoto = async (
  photo: any
): Promise<{ url: string; blurhash: string }> => {
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

  const { createReadStream, mimetype } = await photo;
  // check if file is image
  if (!mimetype.startsWith('image/')) throw new Error('file is not a image');

  const stream = await createReadStream();
  // await upload stream
  const buffer = await streamToPromise(stream);

  // generate file hash
  const fileHash = new Date().getTime() + '.jpeg'; // crypto.createHash('sha256', buffer).digest('hex') + '.jpeg';

  // edit image with sharp
  const image = await sharp(buffer)
    .resize(2560, undefined, { withoutEnlargement: true })
    // convert image format to jpeg
    .jpeg();

  const imageBuffer = await sharp(buffer)
    .resize(2560, undefined, { withoutEnlargement: true })
    // convert image format to jpeg
    .jpeg()
    .toBuffer();

  // S3 parameters
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileHash,
    Body: imageBuffer,
    ACL: 'public-read',
  };

  // upload to S3
  const promise = await s3
    .upload(params, (error: any, data: any) => {
      if (error) throw new Error(error.message);
    })
    .promise();

  // return image url
  // @ts-ignore
  return { url: promise.Location, blurhash: '' };
};

export default UploadPhoto;
