import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description Layerオブジェクトのカラー情報を更新
 *              Update color information of Layer object
 *
 * @param  {number} layer_id
 * @param  {string} color
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, color: string): void =>
{
    const scene = $getCurrentWorkSpace().scene;
    const layer: Layer | null = scene.getLayer(layer_id);
    if (!layer) {
        return ;
    }

    // 内部情報を更新
    layer.color = color;
};