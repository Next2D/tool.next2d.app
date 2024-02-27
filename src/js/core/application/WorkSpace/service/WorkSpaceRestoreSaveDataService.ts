import { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { WorkSpaceSaveObjectImpl } from "@/interface/WorkSpaceSaveObjectImpl";
// @ts-ignore
import ZlibInflateWorker from "@/worker/ZlibInflateWorker?worker&inline";
import { $registerWorkSpace } from "../../CoreUtil";

/**
 * @private
 */
const worker: Worker = new ZlibInflateWorker();

/**
 * @description バイナリデータからプロジェクトを復元
 *              Restore projects from binary data
 *
 * @param  {string} binary
 * @param  {boolean} [share=false]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (binary: string, share: boolean = false): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        // バイナリデータを数値に戻す
        const length: number = binary.length;
        const buffer: Uint8Array = new Uint8Array(length);
        for (let idx: number = 0; idx < length; ++idx) {
            buffer[idx] = binary.charCodeAt(idx) & 0xff;
        }

        worker.onmessage = (event: MessageEvent): void =>
        {
            let value: string = "";

            const buffer: Uint8Array = event.data as NonNullable<Uint8Array>;
            for (let idx: number = 0; idx < buffer.length; idx += 4096) {
                value += String.fromCharCode(...buffer.slice(idx, idx + 4096));
            }

            const workSpaceObjects: WorkSpaceSaveObjectImpl[] = JSON.parse(decodeURIComponent(value));
            for (let idx: number = 0; idx < workSpaceObjects.length; ++idx) {

                const workSpace = new WorkSpace();
                workSpace.load(workSpaceObjects[idx], share);

                $registerWorkSpace(workSpace);
            }

            resolve();
        };

        // データを解凍
        worker.postMessage(buffer, [buffer.buffer]);
    });
};