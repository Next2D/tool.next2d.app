import { $getCanvas } from "@/global/GlobalUtil";
import { execute as soundWaveformGetChannelsUseCase } from "./SoundWaveformGetChannelsUseCase";

/**
 * @description Soundの波形をcanvasに描画
 *              Drawing Sound waveforms in canvas
 *
 * @param  {Uint8Array} buffer
 * @param  {number} width
 * @param  {number} height
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    buffer: Uint8Array | null,
    width: number = 351,
    height: number = 60
): Promise<HTMLCanvasElement> => {

    const canvas = $getCanvas();
    if (!buffer) {
        return canvas;
    }

    const channels = await soundWaveformGetChannelsUseCase(buffer.slice(), width);
    if (!channels) {
        return canvas;
    }

    // size
    canvas.width  = width  * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d", {
        "willReadFrequently": true
    });
    if (!context) {
        return canvas;
    }

    const ch1 = channels[0] as NonNullable<number[]>;
    const ch2 = channels[1] as NonNullable<number[]>;

    const decomposedWidth = canvas.width / ch1.length;
    const halfHeight = canvas.height / 2;

    context.fillStyle = "#1355a5";
    for (let idx: number = 0; idx < ch1.length; ++idx) {

        //ch1
        const ch1Height = ch1[idx] * halfHeight;
        context.fillRect(
            idx * decomposedWidth,
            halfHeight - ch1Height,
            decomposedWidth,
            ch1Height
        );

        //ch2
        const ch2Height = ch2[idx] * halfHeight;
        context.fillRect(
            idx * decomposedWidth,
            halfHeight,
            decomposedWidth,
            ch2Height
        );

    }

    return canvas;
};