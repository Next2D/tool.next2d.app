import { $getCanvas } from "@/global/GlobalUtil";

/**
 * @description Bitmapで保有しているUint8ArrayからImageElementを生成
 *              Generate ImageElement from Uint8Array held in Bitmap
 *
 * @param  {Uint8Array | null} buffer
 * @param  {number} width
 * @param  {number} height
 * @param  {string} type
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (
    buffer: Uint8Array | null,
    width: number,
    height: number
): Promise<HTMLCanvasElement> => {

    return new Promise((resolve): void =>
    {
        const canvas = $getCanvas();
        if (!buffer) {
            return resolve(canvas);
        }

        canvas.width  = width;
        canvas.height = height;

        const context = canvas.getContext("2d", {
            "willReadFrequently": true
        });
        if (!context) {
            return resolve(canvas);
        }

        const imageData = new ImageData(
            new Uint8ClampedArray(buffer.buffer),
            width, height
        );
        context.putImageData(imageData, 0, 0);

        resolve(canvas);
    });
};