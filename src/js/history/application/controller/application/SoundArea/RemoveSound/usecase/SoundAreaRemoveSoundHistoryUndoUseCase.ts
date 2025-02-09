import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ISoundObject } from "@/interface/ISoundObject";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as timelineHeaderUpdateSoundElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateSoundElementService";

/**
 * @description 削除したサウンドを元に戻す
 *              Undo the deleted sound
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {object} sound_object
 * @param  {number} frame
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    sound_object: ISoundObject,
    frame: number,
    index: number
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
        movieClip.setSound(frame, sound_object);
    } else {
        sounds.splice(index, 0, sound_object);
    }

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active && movieClip.active) {
        // サウンド設定エリアの再構築
        if (movieClip.currentFrame === frame) {
            soundAreaRebuildSettingAreaUseCase();
        }

        // サウンドElementを更新
        if (!sounds) {
            const layerIndex = frame - $getLeftFrame();
            const element: HTMLElement | undefined = timelineHeader.elements[layerIndex] as HTMLElement;
            if (!element) {
                return ;
            }

            // タイムラインヘッダーのサウンドElementを更新
            timelineHeaderUpdateSoundElementService(element, frame);
        }
    }
};