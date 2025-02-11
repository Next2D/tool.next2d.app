import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as timelineHeaderUpdateSoundElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateSoundElementService";

/**
 * @description 追加したサウンドを元に戻す
 *              Undo the added sound
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} frame
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    frame: number,
    index: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const sounds = movieClip.getSound(frame);
    if (!sounds) {
        return ;
    }

    // 音声一覧に戻す
    sounds.splice(index, 1);

    // 配列が空になったら削除
    if (!sounds.length) {
        movieClip.deleteSound(frame);
    }

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active && movieClip.active) {
        // サウンド設定エリアの再構築
        if (movieClip.currentFrame === frame) {
            soundAreaRebuildSettingAreaUseCase();
        }

        if (!sounds.length) {
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