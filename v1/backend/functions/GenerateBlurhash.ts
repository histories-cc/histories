import { encode } from 'blurhash';
import { createCanvas, Image, loadImage } from 'canvas';
import sharp from 'sharp';

// get image dimensions and data
function getImageData(image: Image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

async function GenerateBlurhash(buffer: Buffer): Promise<string> {
  // downscale image to speedup blurhash generation
  const downScaledImage = await sharp(buffer)
    .resize(512, undefined, { withoutEnlargement: true })
    .jpeg()
    .toBuffer();

  // get minimized image data, width and height
  const minimizedImageData = await getImageData(
    await loadImage(downScaledImage)
  );

  return await encode(
    minimizedImageData.data,
    minimizedImageData.width,
    minimizedImageData.height,
    6,
    6
  ); // get blurhash from downscaled image
}

export default GenerateBlurhash;
