import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $useSocket } from "@/share/ShareUtil";
import { $LIBRARY_REMOVE_INSTANCE_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as libraryArearRemoveInstanceCreateHistoryObjectService } from "../service/LibraryArearRemoveInstanceCreateHistoryObjectService";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as shareGetS3EndPointRepository } from "@/share/domain/repository/ShareGetS3EndPointRepository";
import { execute as sharePutS3FileRepository } from "@/share/domain/repository/SharePutS3FileRepository";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";

// @ts-ignore
import ZlibDeflateWorker from "@/worker/ZlibDeflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
const worker: Worker = new ZlibDeflateWorker();

/**
 * @description ライブラリのアイテム削除の履歴を登録
 *              Register history of item deletion in the library
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Instance} instance
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    instance: InstanceImpl<any>,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    // fixed logic
    const historyObject = libraryArearRemoveInstanceCreateHistoryObjectService(
        work_space.id, movie_clip.id, instance.toObject()
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($LIBRARY_REMOVE_INSTANCE_COMMAND),
            "",
            ...historyObject.args
        );
    }

    // 追加したLayer Objectを履歴に登録
    work_space.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {

        switch (instance.type) {

            // メディア系はS3を経由して共有する
            case "bitmap":
            case "video":
            case "sound":
                {
                    // 転送用のオブジェクトを作成
                    const instanceObject = instance.toObject();

                    // バイナリは転送しない
                    instanceObject.buffer = "";

                    // 型は揃えるが必要なinstanceObjectだけをセットする
                    const historyObject = libraryArearRemoveInstanceCreateHistoryObjectService(
                        work_space.id, movie_clip.id, instanceObject
                    );

                    shareSendService(historyObject);
                }
                break;

            // メディア以外はjsonで共有
            default:
                shareSendService(historyObject);
                break;

        }

    }
};