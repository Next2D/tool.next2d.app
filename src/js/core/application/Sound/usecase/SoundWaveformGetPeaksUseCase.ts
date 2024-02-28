import { execute as soundWaveformGetPeakService } from "../service/SoundWaveformGetPeakService";

/**
 * @description 波形の幅を配列にして返す
 *              Returns an array of waveform widths
 *
 * @param  {number} buffer
 * @param  {number} width
 * @return {array}
 * @method
 * @public
 */
export const execute = (buffer: Float32Array, width: number): number[] =>
{
    let step = Math.floor(buffer.length / width * window.devicePixelRatio);
    if (step < 1) {
        step = 1;
    }

    const peaks: number[] = [];
    for (let idx = 0; idx < buffer.length; idx += step) {
        peaks.push(
            soundWaveformGetPeakService(buffer, idx, idx + step)
        );
    }

    return peaks;
};