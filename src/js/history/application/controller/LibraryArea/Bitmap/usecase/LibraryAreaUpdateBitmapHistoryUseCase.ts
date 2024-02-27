import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { $useSocket } from "@/share/ShareUtil";
import { $LIBRARY_OVERWRITE_IMAGE_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as libraryAreaUpdateBitmapCreateHistoryObjectService } from "../service/LibraryAreaUpdateBitmapCreateHistoryObjectService";
import { execute as shareSendService } from "@/share/service/ShareSendService";

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
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    before_object: BitmapSaveObjectImpl,
    after_object: BitmapSaveObjectImpl,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(movie_clip);

    // S3判定用のuuid
    const fileId = window.crypto.randomUUID();

    // fixed logic
    const historyObject = libraryAreaUpdateBitmapCreateHistoryObjectService(
        work_space.id, movie_clip.id, before_object, after_object, fileId
    );

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
        shareSendService(historyObject);
    }
};