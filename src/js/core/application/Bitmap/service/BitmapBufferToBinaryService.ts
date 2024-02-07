/**
 * @description Uint8Arrayの情報をバイナリに変換
 *              Convert Uint8Array information to binary
 *
 * @param  {Uint8Array} buffer
 * @return {string}
 * @method
 * @public
 */
export const execute = (buffer: Uint8Array): string =>
{
    // bufferを複製してzlib圧縮
    let binary = "";
    for (let idx = 0; idx < buffer.length; idx += 4096) {
        binary += String.fromCharCode(...buffer.slice(idx, idx + 4096));
    }

    return binary;
};