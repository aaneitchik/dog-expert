import '@tensorflow/tfjs';

import * as mobilenet from '@tensorflow-models/mobilenet';

export async function preloadModel(): Promise<mobilenet.MobileNet> {
  return mobilenet.load();
}

export async function getDogBreed(
  imageUrl: string,
  width: number,
  height: number,
  modelPromise: Promise<mobilenet.MobileNet> | null,
): Promise<string> {
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

  // In case for some reason we didn't start the preload
  let modelPreload = modelPromise;

  if (!modelPreload) {
    modelPreload = preloadModel();
  }

  const model = await modelPreload;
  // The first classification has more probability
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: works fine with OffscreenCanvas actually
  const [mostProbableClassification] = await model.classify(canvas);

  return mostProbableClassification.className.split(',')[0];
}
