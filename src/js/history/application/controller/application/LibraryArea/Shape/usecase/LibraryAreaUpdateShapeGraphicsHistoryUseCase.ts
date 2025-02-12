import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Shape } from "@/core/domain/model/Shape";
import type { IBounds } from "@/interface/IBounds";
import { $useSocket } from "@/share/ShareUtil";
import { $LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as libraryAreaUpdateShapeGraphicsHistoryObjectService } from "../service/LibraryAreaUpdateShapeGraphicsHistoryObjectService";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as shareGetS3EndPointRepository } from "@/share/domain/repository/ShareGetS3EndPointRepository";
import { execute as sharePutS3FileRepository } from "@/share/domain/repository/SharePutS3FileRepository";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";
import { $generateUUID } from "@/global/GlobalUtil";

// @ts-ignore
import ZlibDeflateWorker from "@/worker/ZlibDeflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
const worker: Worker = new ZlibDeflateWorker();

/**
 * @description ShapeのGraphicsの更新を適用を履歴に残す
 *              Apply the update of Shape's Graphics and leave it in the history
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Shape} shape
 * @param  {Float32Array | arrray} recodes
 * @param  {object} bounds
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    shape: Shape,
    recodes: Float32Array | number[],
    bounds: IBounds,
    receiver: boolean = false
): Promise<void> => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    // 上書き前のShapeObjectをセット
    const beforeShapeObject = shape.toObject();

    // TODO 変更前の描画レコードの圧縮

    // fixed logic
    const historyObject = libraryAreaUpdateShapeGraphicsHistoryObjectService(
        work_space.id, movie_clip.id, beforeShapeObject,
        recodes, bounds
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND),
            "",
            ...historyObject.args
        );
    }

    // 追加したLayer Objectを履歴に登録
    work_space.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        await new Promise<void>((reslove): void =>
        {
            const buffer = new Float32Array(recodes);

            // 圧縮が完了したらバイナリデータとして返却
            worker.onmessage = async (event: MessageEvent): Promise<void> =>
            {
                const buffer = event.data as Uint8Array;

                // Uint8Arrayをバイナリに変換
                const binary = bufferToBinaryService(buffer);

                // S3判定用のuuid
                const fileId = $generateUUID();
                const url = await shareGetS3EndPointRepository(fileId, "put");
                await sharePutS3FileRepository(url, binary);

                // 転送用のオブジェクトを作成
                const shapeObject = shape.toObject();

                // 描画レコードは転送しない
                if (shapeObject.recodes) {
                    shapeObject.recodes = [];
                }

                // 転送用の履歴オブジェクトを作成
                const historyObject = libraryAreaUpdateShapeGraphicsHistoryObjectService(
                    work_space.id, movie_clip.id, shapeObject,
                    [], bounds, fileId
                );

                shareSendService(historyObject);

                reslove();
            };

            // Uint8Arrayを複製して、サブスレッドで圧縮処理を行う
            worker.postMessage(buffer, [buffer.buffer]);
        });
    }

    // 自動保存を予約
    userDatabaseAutoSaveReservationUseCase();
};