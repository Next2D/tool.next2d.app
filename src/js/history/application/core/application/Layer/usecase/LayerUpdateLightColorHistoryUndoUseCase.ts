import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerControllerUpdateColorElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateColorElementService";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLightIconElementService";

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

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.layers[index];
    if (!layer) {
        return ;
    }

    // 元の色に戻す
    layer.color = before_color;

    // 起動中ならライブラリエリアの表示を更新
    // アクティブな場合のみ処理を行う
    if (workSpace.active && movieClip.active) {
        // ハイライトカラーを更新
        timelineLayerControllerUpdateColorElementService(layer, layer.color);

        // ハイライトの機能がonの時は表示も更新
        if (layer.light) {
            timelineLayerControllerUpdateLightIconElementService(layer, layer.light);
        }
    }
};