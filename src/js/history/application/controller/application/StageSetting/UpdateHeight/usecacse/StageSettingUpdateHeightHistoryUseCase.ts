import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $useSocket } from "@/share/ShareUtil";
import { $STAGE_HEIGHT_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as stageSettingUpdateHeightCreateHistoryObjectService } from "../service/StageSettingUpdateHeightCreateHistoryObjectService";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description ステージのの高さの更新の履歴を登録
 *              Register the history of updating the height of the stage
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} before_height
 * @param  {number} after_height
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    before_height: number,
    after_height: number,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    // fixed logic
    const historyObject = stageSettingUpdateHeightCreateHistoryObjectService(
        work_space.id, movie_clip, before_height, after_height
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($STAGE_HEIGHT_COMMAND),
            "",
            ...historyObject.args
        );
    }

    // 追加したLayer Objectを履歴に登録
    work_space.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }

    // 自動保存を予約
    userDatabaseAutoSaveReservationUseCase();
};