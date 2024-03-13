import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @param  {array} frames
 * @return {void}
 * @method
 * @public
 */
export const execute = (...frames: number[]): void =>
{
    const minFrame = Math.min(
        timelineLayer.selectedFrameObject.start,
        timelineLayer.selectedFrameObject.end
    );
    const maxFrame = Math.min(
        timelineLayer.selectedFrameObject.start,
        timelineLayer.selectedFrameObject.end
    ) + 1;

    //
};