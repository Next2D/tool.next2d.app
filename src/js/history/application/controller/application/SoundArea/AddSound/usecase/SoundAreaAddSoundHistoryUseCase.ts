import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ISoundObject } from "@/interface/ISoundObject";
import { $useSocket } from "@/share/ShareUtil";
import { $SOUND_AREA_ADD_SOUND_COMMAND } from "@/config/HistoryConfig";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as soundAreaAddSoundCreateHistoryObjectService } from "../service/SoundAreaAddSoundCreateHistoryObjectService";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description タイムラインへのサウンド追加の履歴を登録
 *              Register the history of adding sound to the timeline
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @param  {object} sound_object
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    sound_object: ISoundObject,
    frame: number,
    receiver: boolean = false
): Promise<void> => {

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
    const historyObject = soundAreaAddSoundCreateHistoryObjectService(
        work_space.id, movie_clip, sound_object,
        frame, sounds.indexOf(sound_object), instance.name
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($SOUND_AREA_ADD_SOUND_COMMAND),
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
    await userDatabaseAutoSaveReservationUseCase();
};