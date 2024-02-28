/**
 * @description 個別の波形の幅を返す
 *              Returns the width of individual waveforms
 *
 * @param  {number} buffer
 * @param  {number} start_index
 * @param  {number} end_index
 * @return {number}
 * @method
 * @public
 */
export const execute = (buffer: Float32Array, start_index: number, end_index: number): number =>
{
    const sliced: Float32Array = buffer.slice(start_index, end_index);

    let peak: number = -100;
    for (let idx: number = 0; idx < sliced.length; idx++) {
        const sample: number = sliced[idx];
        if (sample > peak) {
            peak = sample;
        }
    }

    return peak;
};