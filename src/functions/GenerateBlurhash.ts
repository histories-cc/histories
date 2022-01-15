import sharp from 'sharp';
import {
  Canvas,
  createCanvas,
  Image,
  loadImage,
  NodeCanvasRenderingContext2D,
} from 'canvas';
import { encode } from 'blurhash';

// get image dimensions and data
function getImageData(image: Image) {
  const canvas: Canvas = createCanvas(image.width, image.height);
  const context: NodeCanvasRenderingContext2D = canvas.getContext('2d');
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
