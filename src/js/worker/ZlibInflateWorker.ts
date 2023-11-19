import { decompressSync } from "fflate";

/**
 * @description zlibを解凍してUint8Arrayで返却
 *              Decompress zlib and return as Uint8Array
 *
 * @params {MessageEvent} event
 * @return {void}
 * @method
 * @public
 */
self.addEventListener("message", (event: MessageEvent): void =>
{
    const buffer: Uint8Array = decompressSync(event.data);

    // @ts-ignore
    self.postMessage(buffer, [buffer.buffer]);
});

export default {};