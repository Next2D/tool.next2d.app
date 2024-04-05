import { MovieClip } from "@/core/domain/model/MovieClip";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameActiveElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameActiveElementService";
import { execute as timelineLayerActiveElementService } from "../service/TimelineLayerActiveElementService";

/**
 * @description 選択中のレイヤーとフレームをアクティブ表示の更新
 *              Update the active display of selected layers and frames
 *
 * @param  {MovieClip} movie_clip
 * @param  {array} selected_frames
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, selected_frames: number[]): void =>
{
    const leftFrame = $getLeftFrame();
    for (let idx = 0; idx < movie_clip.selectedLayers.length; ++idx) {

        const layer = movie_clip.selectedLayers[idx];

        const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
        if (!layerElement) {
            continue ;
        }

        // レイヤーのアクティブ表示を初期化
        timelineLayerActiveElementService(layerElement);

        // フレーム側のElementを更新
        const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;
        const children = frameElement.children;
        const length   = children.length;
        for (let idx = 0; selected_frames.length > idx; ++idx) {

            const frame = selected_frames[idx];

            const frameIndex = frame - leftFrame;
            if (frameIndex > length) {
                continue;
            }

            const element: HTMLElement | undefined = children[frameIndex] as HTMLElement;
            if (!element || element.classList.contains("frame-active")) {
                continue;
            }

            // フレームのアクティブ表示を初期化
            timelineLayerFrameActiveElementService(element);
        }
    }
};