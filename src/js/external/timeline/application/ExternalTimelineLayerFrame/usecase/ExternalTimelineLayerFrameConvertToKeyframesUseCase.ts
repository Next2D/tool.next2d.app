import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $convertFrameObject } from "@/timeline/application/TimelineUtil";

/**
 * @description 選択中のレイヤーにキーフレームを追加
 *              Add a keyframe to the selected layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} start_frame
 * @param  {number} end_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    start_frame: number,
    end_frame: number = 0
): void => {

    // レイヤーが何も選択されてなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    const frameObject = $convertFrameObject(start_frame, end_frame);
    console.log(work_space, frameObject);
};