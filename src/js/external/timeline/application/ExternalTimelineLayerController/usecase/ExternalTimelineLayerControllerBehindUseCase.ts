import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerControllerBehindNormalUseCase } from "./ExternalTimelineLayerControllerBehindNormalUseCase";
import { execute as externalTimelineLayerControllerBehindRelationUseCase } from "./ExternalTimelineLayerControllerBehindRelationUseCase";
import { execute as externalTimelineLayerControllerCheckTerminateRelationshipUseCase } from "./ExternalTimelineLayerControllerCheckTerminateRelationshipUseCase";
import {
    $GUIDE_IN_MODE,
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description 指定のindex値の後ろに選択中のレイヤーを移動
 *              Move the selected layer behind the specified index value
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} index
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number
): Promise<void> => {

    // 選択中のレイヤーがなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    // 移動先のレイヤーを取得
    const distLayer = movie_clip.getLayer(index);
    if (!distLayer) {
        return ;
    }

    switch (distLayer.mode) {

        case $MASK_MODE: // マスクレイヤー
        case $GUIDE_MODE: // ガイドレイヤー
            await externalTimelineLayerControllerBehindRelationUseCase(
                work_space,
                movie_clip,
                index
            );
            break;

        case $MASK_IN_MODE: // マスクの子レイヤー
        case $GUIDE_IN_MODE: // ガイドの子レイヤー
            await externalTimelineLayerControllerCheckTerminateRelationshipUseCase(
                work_space,
                movie_clip,
                index
            );
            break;

        default:
            await externalTimelineLayerControllerBehindNormalUseCase(
                work_space,
                movie_clip,
                distLayer
            );
            break;

    }
};