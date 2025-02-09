import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $useSocket } from "@/share/ShareUtil";
import { $SOUND_AREA_REMOVE_SOUND_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as soundAreaRemoveSoundCreateHistoryObjectService } from "../service/SoundAreaRemoveSoundCreateHistoryObjectService";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { ISoundObject } from "@/interface/ISoundObject";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description タイムラインへのサウンド削除の履歴を登録
 *              Register sound deletion history to the timeline
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {object} sound_object
 * @param  {number} frame
 * @param  {number} index
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    sound_object: ISoundObject,
    frame: number,
    index: number,
    receiver: boolean = false
): void => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    const instance = work_space.getLibrary(sound_object.libraryId);
    if (!instance) {
        return ;
    }

    const sounds = movie_clip.getSound(frame);
    if (!sounds) {
        return ;
    }

    // fixed logic
    const historyObject = soundAreaRemoveSoundCreateHistoryObjectService(
        work_space.id, movie_clip, sound_object,
        frame, index, instance.name
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($SOUND_AREA_REMOVE_SOUND_COMMAND),
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