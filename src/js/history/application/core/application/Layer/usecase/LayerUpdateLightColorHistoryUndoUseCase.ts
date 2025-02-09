import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerControllerUpdateColorUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerUpdateColorUseCase";

/**
 * @description レイヤーのハイライトカラーを元のカラーに戻す
 *              Reset the layer's highlight color to the original color
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {string} before_color
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    before_color: string
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: IInstance<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    // 元の色に戻す
    layer.color = before_color;

    // 起動中ならライブラリエリアの表示を更新
    // アクティブな場合のみ処理を行う
    if (workSpace.active && movieClip.active) {
        // ハイライトカラーを更新
        timelineLayerControllerUpdateColorUseCase(layer);
    }
};