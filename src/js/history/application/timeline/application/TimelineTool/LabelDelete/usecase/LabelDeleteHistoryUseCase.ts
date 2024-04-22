import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $LABEL_DELETE_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as labelDeleteHistoryObjectService } from "../service/LabelDeleteHistoryObjectService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description ラベルの削除履歴を登録
 *              Register label deletion history
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frame: number,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    // 編集前のラベルをセット
    const beforeLabel = movie_clip.getLabel(frame);

    // fixed logic
    const historyObject = labelDeleteHistoryObjectService(
        work_space.id, movie_clip, frame, beforeLabel
    );

    // 追加したLayer Objectを履歴に登録
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($LABEL_DELETE_COMMAND),
            "",
            ...historyObject.args
        );
    }

    // Objectを履歴に登録
    // fixed logic
    work_space.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }

    // 自動保存を予約
    userDatabaseAutoSaveReservationUseCase();
};