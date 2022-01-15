import * as blurhash from 'blurhash';
import { createCanvas, Image, loadImage } from 'canvas';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import sharp from 'sharp';

// get image dimensions
function getImageData(image: Image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

export function CreateInfuraClient(): IPFSHTTPClient {
  // if infura credentials are not set, throw error
  if (!process.env.INFURA_PROJECT_ID)
    throw new Error('Infura project ID is not defined');
  if (!process.env.INFURA_PROJECT_SECRET)
    throw new Error('Infura project secret is not defined');

  // create authentication string
  const auth =
    'Basic ' +
    Buffer.from(
      process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET
    ).toString('base64');

  // create IPFS client
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  return client;
}

// upload to IPFS using Infura api
async function UploadPhoto(photo: Buffer) {
  const client =
    process.env.IPFS_CLIENT == 'default' ? create() : CreateInfuraClient();

  // use original image to get width and heigt
  const image = await loadImage(photo); // load image from buffer
  const imageData = getImageData(image); // get image data

  const uploaded = await client.add(photo);

  return {
    hash: uploaded.path,
    width: imageData.width,
    height: imageData.height,
  };
}

export default UploadPhoto;
