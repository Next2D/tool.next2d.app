import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLeftFrame } from "../../TimelineUtil";

/**
 * @description 指定レイヤーElementを非アクティブに更新
 *              Update specified Layer Element to inactive
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, layer: Layer): void =>
{
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    // レイヤーのアクティブ表示を初期化
    layerElement.classList.remove("active");

    const leftFrame  = $getLeftFrame();
    const startFrame = movie_clip.selectedStartFrame;
    const endFrame   = movie_clip.selectedEndFrame;

    // フレームが未選択の場合は終了
    if (!startFrame) {
        return ;
    }

    // フレーム側のElementを更新
    const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;
    const children = frameElement.children;
    const length   = children.length;
    for (let frame: number = startFrame; endFrame > frame; ++frame) {

        const frameIndex = frame - leftFrame;
        if (frameIndex > length) {
            continue;
        }

        const element: HTMLElement | undefined = children[frameIndex] as HTMLElement;
        if (!element) {
            continue;
        }

        // フレームのアクティブ表示を初期化
        element.classList.remove("frame-active");
    }
};