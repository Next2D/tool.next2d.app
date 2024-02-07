/**
 * @description バイナリ情報をUint8Arrayに変換
 *              Convert binary information to Uint8Array
 *
 * @param  {string} binary
 * @return {Uint8Array}
 * @method
 * @public
 */
export const execute = (binary: string): Uint8Array =>
{
    const length: number = binary.length;

    const buffer: Uint8Array = new Uint8Array(length);
    for (let idx: number = 0; idx < length; ++idx) {
        buffer[idx] = binary.charCodeAt(idx) & 0xff;
    }

    return buffer;
};