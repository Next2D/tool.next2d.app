import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerFrameBehindKeyframeService } from "../service/ExternalTimelineLayerFrameBehindKeyframeService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";

/**
 * @description 現在のフレームで、選択中のレイヤーに指定数のフレームを挿入
 *              Insert the specified number of frames into the selected layer at the current frame
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} num_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    num_frame: number
): void => {

    // レイヤーが何も選択されてなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    const frame = movie_clip.currentFrame;
    const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        if (activeCharacters.length) {
            // TODO
        } else {
            const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
            if (activeEmptyCharacter) {
                externalTimelineLayerFrameBehindKeyframeService(
                    layer,
                    activeEmptyCharacter.endFrame,
                    num_frame
                );

                // フレーム幅を拡張
                activeEmptyCharacter.endFrame += num_frame;

                // 履歴に追加
            }
        }

        if (work_space.active && movie_clip.active) {

            const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
            if (!layerElement) {
                return ;
            }

            // レイヤーのフレームスタイルを更新
            timelineLayerFrameUpdateStyleService(
                work_space, movie_clip,
                layerElement.lastElementChild as NonNullable<HTMLElement>,
                $getLeftFrame()
            );

            // タイムラインの幅を更新
            timelineScrollUpdateWidthService();
        }
    }
};