import '@tensorflow/tfjs';

import * as mobilenet from '@tensorflow-models/mobilenet';

let modelPromise: Promise<mobilenet.MobileNet> | undefined;

export async function preloadModel(): Promise<void> {
  modelPromise = mobilenet.load();
  await modelPromise;
}

export async function getOffscreenCanvasFromImageUrl(
  imageUrl: string,
  width: number,
  height: number,
): Promise<OffscreenCanvas> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const imageBitmap = await createImageBitmap(blob);
  // At the time of writing, supported only in Chromium
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error("Couldn't create image");
  }

  context.drawImage(imageBitmap, 0, 0);

  return canvas;
}

export async function getDogBreed(
  source: string | ImageData,
  width: number,
  height: number,
): Promise<string> {
  const imageSource =
    typeof source === 'string'
      ? await getOffscreenCanvasFromImageUrl(source, width, height)
      : source;

  // In case for some reason we didn't start the preload
  if (!modelPromise) {
    await preloadModel();
  }

  const model = await modelPromise;
  // The first classification has more probability
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: works fine with OffscreenCanvas actually
  const [mostProbableClassification] = await model.classify(imageSource);

  return mostProbableClassification.className.split(',')[0];
}
