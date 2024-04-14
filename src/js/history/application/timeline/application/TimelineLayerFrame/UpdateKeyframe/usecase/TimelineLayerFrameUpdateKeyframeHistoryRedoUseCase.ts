import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

/**
 * @description 空のキーフレーム変更処理を元に戻す
 *              Undo the empty keyframe change process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} keyframe
 * @param  {number} after_end_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    keyframe: number,
    after_end_frame: number
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // レイヤーを抜き出し
    const layer = movieClip.layers[layer_index];
    if (!layer) {
        return ;
    }

    const characters = layer.getActiveCharacters(keyframe);
    if (!characters.length) {
        return ;
    }

    for (let idx = 0; idx < characters.length; idx++) {
        const character = characters[idx];
        if (!character) {
            continue;
        }

        // 終了フレームを変更
        character.endFrame = after_end_frame;
    }

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(workSpace, movieClip, layer);

        // スクリーンを再描画
        await screenAreaRedrawUseCase(movieClip);
    }
};