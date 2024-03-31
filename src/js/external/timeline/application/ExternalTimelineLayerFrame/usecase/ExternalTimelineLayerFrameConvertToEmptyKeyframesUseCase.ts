import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $convertFrameObject } from "@/timeline/application/TimelineUtil";

/**
 * @description 選択中のレイヤーに空のキーフレームを追加
 *              Add an empty keyframe to the selected layer
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
): void =>
{
    // レイヤーが何も選択されてなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    const frameObject = $convertFrameObject(start_frame, end_frame);
    console.log(frameObject);

    // 昇順に並び替えたレイヤー配列を取得
    const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        console.log(layer);
    }
};