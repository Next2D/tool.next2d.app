import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerFrameInsertEmptyFramesUseCase } from "./ExternalTimelineLayerFrameInsertEmptyFramesUseCase";

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
            continue;
        }

        const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (activeEmptyCharacter) {
            // 空のキーフレームにフレームを挿入
            externalTimelineLayerFrameInsertEmptyFramesUseCase(
                work_space,
                movie_clip,
                layer,
                activeEmptyCharacter,
                num_frame
            );
        }
    }
};