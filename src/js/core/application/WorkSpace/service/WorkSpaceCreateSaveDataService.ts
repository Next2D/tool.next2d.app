import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $getAllWorkSpace } from "../../CoreUtil";
// @ts-ignore
import ZlibDeflateWorker from "@/worker/ZlibDeflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
const worker: Worker = new ZlibDeflateWorker();

/**
 * @description 現在起動中の全てのWorkSpaceをバイナリに変換
 *              Convert all currently running WorkSpaces to binary
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<Uint8Array | null> =>
{
    return new Promise((reslove) =>
    {
        // 全てのWorkSpcaceからobjectを取得
        const workSpaces: WorkSpace[] = $getAllWorkSpace();
        if (!workSpaces.length) {
            return reslove(null);
        }

        const objects = [];
        for (let idx = 0; idx < workSpaces.length; ++idx) {
            const workSpace: WorkSpace = workSpaces[idx];
            objects.push(workSpace.toObject());
        }

        const value = encodeURIComponent(JSON.stringify(objects));
        const buffer: Uint8Array = new Uint8Array(value.length);
        for (let idx: number = 0; idx < value.length; ++idx) {
            buffer[idx] = value[idx].charCodeAt(0);
        }

        // サブスレッドで圧縮処理を行う
        worker.postMessage(buffer, [buffer.buffer]);

        // 圧縮が完了したらバイナリデータとして返却
        worker.onmessage = (event: MessageEvent): void =>
        {
            reslove(event.data);
        };
    });
};