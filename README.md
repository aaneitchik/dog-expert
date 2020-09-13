# Dog expert

Takes an image uploaded by the user and recognizes its breed by using a
pre-trained TensorFlow.js model [MobileNet]. Then displays images of dogs of the
same breed (fetched from [Dog API]) in an inifitely scrollable gallery.

You can see the demo [here] (Chrome only)

![Dog expert](https://user-images.githubusercontent.com/11046028/93025940-db71de00-f60a-11ea-92ad-c72e2853eeab.jpg)

## Available scripts

To start the project, simply run:

```bash
npm install   // first time only
npm run start
```

To create and then serve your own build:

```bash
npm run build
npx serve dist
```

## Some technical details

- Project is written in TypeScript, this is actually my first time using it
- To reduce the load on the main thread, all image classification happens inside
  a separate Web Worker. For easier usage, Web Worker is loaded with
  [comlink-loader]
- The MobileNet model requires an image to be passed to its `classify` method
  and since it happens in a Web Worker, `OffscreenCanvas` is used.
- Infinite scroll implemented with `IntersectionObserver`

## Browser support

Since it uses `OffscreenCanvas`, at the time of writing it works only in
Chromium browsers (or can be enabled via a flag in Firefox).

## Credits

Started this as a test assignment from [this boilerplate]

[mobilenet]: https://github.com/tensorflow/tfjs-models/tree/master/mobilenet
[dog api]: https://dog.ceo/dog-api/
[this boilerplate]: https://github.com/ridedott/frontend-assignment-boilerplate
[comlink-loader]: https://github.com/GoogleChromeLabs/comlink-loader
[here]: https://aaneitchik.github.io/dog-expert
