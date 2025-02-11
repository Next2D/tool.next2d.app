import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { IShapeSaveObject } from "@/interface/IShapeSaveObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IBounds } from "@/interface/IBounds";
import type { Shape } from "@/core/domain/model/Shape";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalShapeApplyGraphicsUseCase } from "@/external/core/application/ExternalShape/usecase/ExternalShapeApplyGraphicsUseCase";
import { execute as shareGetS3EndPointRepository } from "@/share/domain/repository/ShareGetS3EndPointRepository";
import { execute as shareGetS3FileRepository } from "@/share/domain/repository/ShareGetS3FileRepository";
import { execute as binaryToBufferService } from "@/core/service/BinaryToBufferService";

// @ts-ignore
import ZlibInflateWorker from "@/worker/ZlibInflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
const worker: Worker = new ZlibInflateWorker();

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {object} message
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (message: IShareReceiveMessage): Promise<void> =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip = workSpace.getLibrary(libraryId) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const beforeShapeObject = message.data[2] as IShapeSaveObject;
    const shape = workSpace.getLibrary(beforeShapeObject.id) as Shape;
    if (!shape) {
        return ;
    }
    // バイナリをUint8Arrayに変換
    const url = await shareGetS3EndPointRepository(message.data[5] as string, "get");
    const binary = await shareGetS3FileRepository(url);
    const buffer: Uint8Array = binaryToBufferService(binary);

    return new Promise((reslove): void =>
    {
        // 解凍が完了したらバイナリデータとして返却
        worker.onmessage = async (event: MessageEvent): Promise<void> =>
        {
            // Shapeのグラフィックスを更新
            await externalShapeApplyGraphicsUseCase(
                workSpace,
                movieClip,
                shape,
                new Float32Array(event.data), // 解凍したデータをFloat32Arrayに変換
                message.data[4] as IBounds,
                true
            );

            reslove();
        };

        // サブスレッドで解答処理を行う
        worker.postMessage(buffer, [buffer.buffer]);
    });
};