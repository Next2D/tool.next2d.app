/**
 * @description 個別の波形の幅を返す
 *              Returns the width of individual waveforms
 *
 * @param  {Float32Array} buffer
 * @param  {number} start_index
 * @param  {number} end_index
 * @return {number}
 * @method
 * @public
 */
export const execute = (buffer: Float32Array, start_index: number, end_index: number): number =>
{
    const sliced = buffer.slice(start_index, end_index);

    let peak = -100;
    for (let idx = 0; idx < sliced.length; idx++) {
        const sample = sliced[idx];
        if (sample > peak) {
            peak = sample;
        }
    }

    return peak;
};