import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $useSocket } from "@/share/ShareUtil";
import { $LIBRARY_ADD_NEW_BITMAP_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as libraryAreaAddNewBitmapCreateHistoryObjectService } from "../service/LibraryAreaAddNewBitmapCreateHistoryObjectService";
import { execute as shareSendService } from "@/share/service/ShareSendService";

/**
 * @description 新規bitmap追加の履歴を登録
 *              Register history of new bitmap additions
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Bitmap} bitmap
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    bitmap: Bitmap,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(movie_clip);

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active && movie_clip.actions) {
        historyAddElementUseCase(
            movie_clip.historyIndex,
            historyGetTextService($LIBRARY_ADD_NEW_BITMAP_COMMAND)
        );
    }

    const historyObject = libraryAreaAddNewBitmapCreateHistoryObjectService(
        work_space.id, movie_clip.id, bitmap
    );

    // 追加したLayer Objectを履歴に登録
    movie_clip.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }
};