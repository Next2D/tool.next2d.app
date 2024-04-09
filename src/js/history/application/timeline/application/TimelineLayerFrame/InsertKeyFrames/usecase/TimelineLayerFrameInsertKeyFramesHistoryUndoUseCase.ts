import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as externalTimelineLayerFrameForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameForwardKeyframeService";

/**
 * @description キーフレームへのフレーム追加処理を元に戻す
 *              Undo the process of adding a frame to a keyframe
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} layer_index
 * @param  {number} start_frame
 * @param  {number} num_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    layer_index: number,
    start_frame: number,
    num_frame: number
): void => {

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

    const characters = layer.getActiveCharacters(start_frame);
    if (!characters.length) {
        return ;
    }

    // 前方にキーフレームを移動
    externalTimelineLayerFrameForwardKeyframeService(
        layer, characters[0].endFrame, num_frame
    );

    for (let idx = 0; idx < characters.length; ++idx) {
        const character = characters[idx];
        character.endFrame -= num_frame;

    }

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
        if (!layerElement) {
            return ;
        }

        // レイヤーのフレームスタイルを更新
        timelineLayerFrameUpdateStyleService(
            workSpace, movieClip,
            layerElement.lastElementChild as NonNullable<HTMLElement>,
            $getLeftFrame()
        );

        // タイムラインの幅を更新
        timelineScrollUpdateWidthService();
    }
};