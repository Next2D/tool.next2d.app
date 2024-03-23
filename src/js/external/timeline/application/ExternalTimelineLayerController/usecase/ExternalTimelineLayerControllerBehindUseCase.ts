import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerControllerBehindNormalUseCase } from "./ExternalTimelineLayerControllerBehindNormalUseCase";
import { execute as externalTimelineLayerControllerBehindRelationUseCase } from "./ExternalTimelineLayerControllerBehindRelationUseCase";

/**
 * @description 指定のindex値の後ろに選択中のレイヤーを移動
 *              Move the selected layer behind the specified index value
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number
): void => {

    // 選択中のレイヤーがなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    // MovieClipのレイヤー配列を取得
    const layers = movie_clip.layers;

    // 移動先のレイヤーを取得
    const distLayer = layers[index];

    switch (distLayer.mode) {

        case 1: // マスクレイヤー
        case 2: // マスクの子レイヤー
        case 3: // ガイドレイヤー
        case 4: // ガイドの子レイヤー
            externalTimelineLayerControllerBehindRelationUseCase(
                work_space,
                movie_clip,
                index
            );
            break;

        default:
            externalTimelineLayerControllerBehindNormalUseCase(
                work_space,
                movie_clip,
                distLayer
            );
            break;

    }
};