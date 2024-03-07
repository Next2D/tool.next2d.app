import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { execute as libraryAreaUpdateBitmapHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Bitmap/usecase/LibraryAreaUpdateBitmapHistoryUseCase";
import { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { execute as shareGetS3EndPointRepository } from "@/share/domain/repository/ShareGetS3EndPointRepository";
import { execute as shareGetS3FileRepository } from "@/share/domain/repository/ShareGetS3FileRepository";
import { execute as binaryToBufferService } from "@/core/service/BinaryToBufferService";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

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
export const execute = async (message: ShareReceiveMessageImpl): Promise<void> =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    // バイナリをUint8Arrayに変換
    const bitmapObject = message.data[3] as NonNullable<BitmapSaveObjectImpl>;

    // 変更前のインスタンスからセーブオブジェクトを作成
    const instance: InstanceImpl<any> = workSpace.getLibrary(bitmapObject.id);
    const beforeSaveObject = instance.toObject();

    // バイナリをUint8Arrayに変換
    const url = await shareGetS3EndPointRepository(message.data[4] as string, "get");
    const binary = await shareGetS3FileRepository(url);
    const buffer: Uint8Array = binaryToBufferService(binary);

    return new Promise((reslove): void =>
    {
        worker.onmessage = (event: MessageEvent): void =>
        {
            bitmapObject.buffer = event.data as Uint8Array;
            const bitmap = new Bitmap(bitmapObject);

            // 内部情報に追加
            // fixed logic
            workSpace.libraries.set(bitmap.id, bitmap);

            // 作業履歴に残す
            // fixed logic
            libraryAreaUpdateBitmapHistoryUseCase(
                workSpace,
                movieClip,
                beforeSaveObject,
                bitmap,
                true
            );

            // 起動中のプロジェクトならライブラリを再描画
            if (workSpace.active) {
                // プレビューエリアを初期化
                libraryAreaSelectedClearUseCase();

                // ライブラリ再描画
                libraryAreaReloadUseCase();
            }

            reslove();
        };

        // サブスレッドで解答処理を行う
        worker.postMessage(buffer, [buffer.buffer]);
    });
};