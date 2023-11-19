import { deflateSync } from "fflate";

/**
 * @description 渡ってきたUint8Arrayをzlibで圧縮する
 *              Compress the passed Uint8Array with zlib
 *
 * @params {MessageEvent} event
 * @return {void}
 * @method
 * @public
 */
self.addEventListener("message", (event: MessageEvent): void =>
{
    const buffer: Uint8Array = deflateSync(event.data);

    // @ts-ignore
    self.postMessage(buffer, [buffer.buffer]);
});

export default {};