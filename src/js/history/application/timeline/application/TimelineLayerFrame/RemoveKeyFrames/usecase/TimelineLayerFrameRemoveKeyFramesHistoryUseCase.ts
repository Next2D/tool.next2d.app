import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as timelineLayerFrameRemoveKeyFramesCreateHistoryObjectService } from "../service/TimelineLayerFrameRemoveKeyFramesCreateHistoryObjectService";
import { $TIMELINE_REMOVE_KEY_FRAMES_COMMAND } from "@/config/HistoryConfig";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase"

/**
 * @description キーフレームのフレーム削除の履歴を登録
 *              Register history of frame deletion for keyframes
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} keyframe
 * @param  {number} before_end_frame
 * @param  {number} after_end_frame
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    keyframe: number,
    before_end_frame: number,
    after_end_frame: number,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    // fixed logic
    const historyObject = timelineLayerFrameRemoveKeyFramesCreateHistoryObjectService(
        work_space.id, movie_clip, layer,
        keyframe, before_end_frame, after_end_frame
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($TIMELINE_REMOVE_KEY_FRAMES_COMMAND),
            "",
            ...historyObject.args
        );
    }

    // 追加したLayer Objectを履歴に登録
    // fixed logic
    work_space.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }

    // 自動保存を予約
    userDatabaseAutoSaveReservationUseCase();
};