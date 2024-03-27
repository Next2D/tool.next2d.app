import { $getLeftFrame } from "../../TimelineUtil";
import { execute as timelineLayerFrameInactiveElementService } from "../service/TimelineLayerFrameInactiveElementService";
import { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 指定のフレーム範囲のElementを全て非アクティブにする
 *              Make all elements in the specified frame range inactive
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, movie_clip: MovieClip): void =>
{
    const leftFrame  = $getLeftFrame();
    const startFrame = movie_clip.selectedStartFrame;
    const endFrame   = movie_clip.selectedEndFrame;

    const children = element.children;
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

        timelineLayerFrameInactiveElementService(element);
    }
};