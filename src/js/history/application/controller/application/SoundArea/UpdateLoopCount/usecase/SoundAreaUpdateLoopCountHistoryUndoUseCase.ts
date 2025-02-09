import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as soundAreaUpdateLoopCountElementService } from "@/controller/application/SoundArea/service/SoundAreaUpdateLoopCountElementService";

/**
 * @description 個別のループ回数の更新の履歴を登録を元に戻す
 *              Undo registration of individual loop count update history.
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} frame
 * @param  {number} index
 * @param  {number} before_loop_count
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    frame: number,
    index: number,
    before_loop_count: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: IInstance<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // 音声一覧に戻す
    const sounds = movieClip.getSound(frame);
    if (!sounds) {
        return ;
    }

    // ループ回数を変更前の状態に戻す
    const soundObject = sounds[index];
    soundObject.loopCount = before_loop_count;

    // 音量の表示を更新
    if (workSpace.active && movieClip.active
        && movieClip.currentFrame === frame
    ) {
        soundAreaUpdateLoopCountElementService(soundObject, index);
    }
};