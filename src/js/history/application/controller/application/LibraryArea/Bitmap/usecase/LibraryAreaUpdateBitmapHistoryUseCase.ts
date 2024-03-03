import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { Bitmap } from "@/core/domain/model/Bitmap";
import { $useSocket } from "@/share/ShareUtil";
import { $LIBRARY_OVERWRITE_IMAGE_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as libraryAreaUpdateBitmapCreateHistoryObjectService } from "../service/LibraryAreaUpdateBitmapCreateHistoryObjectService";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";
import { execute as shareGetS3EndPointRepository } from "@/share/domain/repository/ShareGetS3EndPointRepository";
import { execute as sharePutS3FileRepository } from "@/share/domain/repository/SharePutS3FileRepository";

// @ts-ignore
import ZlibDeflateWorker from "@/worker/ZlibDeflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
const worker: Worker = new ZlibDeflateWorker();

/**
 * @description 新規bitmap追加の履歴を登録
 *              Register history of new bitmap additions
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Bitmap} bitmap
 * @param  {Uint8Array} buffer
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    before_object: BitmapSaveObjectImpl,
    bitmap: Bitmap,
    receiver: boolean = false
): Promise<void> => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(movie_clip);

    // fileIdは不要なので空文字をセット
    // fixed logic
    const historyObject = libraryAreaUpdateBitmapCreateHistoryObjectService(
        work_space.id, movie_clip.id, before_object, bitmap.toObject(), ""
    );

    // 履歴にはfileIdは不要なので削除
    historyObject.messages.pop();

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active && movie_clip.actions) {
        historyAddElementUseCase(
            movie_clip.historyIndex,
            historyGetTextService($LIBRARY_OVERWRITE_IMAGE_COMMAND),
            "",
            ...historyObject.args
        );
    }

    // 追加したLayer Objectを履歴に登録
    // fixed logic
    movie_clip.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {

        await new Promise<void>((reslove): void =>
        {
            if (!bitmap.buffer) {
                return ;
            }

            // 圧縮が完了したらバイナリデータとして返却
            worker.onmessage = async (event: MessageEvent): Promise<void> =>
            {
                const buffer = event.data as Uint8Array;

                // Uint8Arrayをバイナリに変換
                const binary = bufferToBinaryService(buffer);

                // S3判定用のuuid
                const fileId = window.crypto.randomUUID();
                const url = await shareGetS3EndPointRepository(fileId, "put");
                await sharePutS3FileRepository(url, binary);

                // 転送用のオブジェクトを作成
                const bitmapObject = bitmap.toObject();

                // バイナリは転送しない
                bitmapObject.buffer = "";

                // 型は揃えるが必要なbitmapObjectだけをセットする
                const historyObject = libraryAreaUpdateBitmapCreateHistoryObjectService(
                    work_space.id, movie_clip.id, bitmapObject, bitmapObject, fileId
                );

                shareSendService(historyObject);

                reslove();
            };

            // Uint8Arrayを複製して、サブスレッドで圧縮処理を行う
            const buffer: Uint8Array = bitmap.buffer.slice();
            worker.postMessage(buffer, [buffer.buffer]);
        });
    }
};