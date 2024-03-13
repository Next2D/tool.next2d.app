import { MovieClip } from "@/core/domain/model/MovieClip";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameActiveElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameActiveElementService";

/**
 * @description
 *
 * @param  {MovieClip} movie_clip
 * @param  {array} frames
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, frames: number[]): void =>
{
    const leftFrame = $getLeftFrame();
    for (let idx = 0; idx < movie_clip.selectedLayers.length; ++idx) {

        const layer = movie_clip.selectedLayers[idx];

        const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
        if (!layerElement) {
            continue ;
        }

        // レイヤーのアクティブ表示を初期化
        if (!layerElement.classList.contains("active")) {
            layerElement.classList.add("active");
        }

        // フレーム側のElementを更新
        const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;
        const children = frameElement.children;
        const length   = children.length;
        for (let idx = 0; frames.length > idx; ++idx) {

            const frame = frames[idx];

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