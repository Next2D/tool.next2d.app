import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $registerWorkSpace } from "../../CoreUtil";
import { execute as binaryToBufferService } from "@/core/service/BinaryToBufferService";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";
import { execute as migrationSaveDataUseCase } from "@/migration/usecase/MigrationSaveDataUseCase";

// @ts-ignore
import ZlibInflateWorker from "@/worker/ZlibInflateWorker?worker&inline";

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
export const execute = async (binary: string, share: boolean = false): Promise<void> =>
{
    await new Promise<void>((resolve): void =>
    {
        worker.onmessage = async (event: MessageEvent): Promise<void> =>
        {
            const value = bufferToBinaryService(
                event.data as NonNullable<Uint8Array>
            );

            const workSpaceObjects = migrationSaveDataUseCase(
                JSON.parse(decodeURIComponent(value))
            );

            // データを復元
            for (let idx = 0; idx < workSpaceObjects.length; ++idx) {

                const workSpace = new WorkSpace();
                await workSpace.load(workSpaceObjects[idx], share);

                $registerWorkSpace(workSpace);
            }

            resolve();
        };

        // データを解凍
        const buffer = binaryToBufferService(binary);
        worker.postMessage(buffer, [buffer.buffer]);
    });
};