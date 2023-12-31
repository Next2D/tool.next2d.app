import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description Layerオブジェクトのハイライト設置を更新
 *              Update highlight installation of Layer object
 *
 * @param  {number} layer_id
 * @param  {boolean} light
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, light: boolean): void =>
{
    const scene = $getCurrentWorkSpace().scene;
    const layer: Layer | null = scene.getLayer(layer_id);
    if (!layer) {
        return ;
    }

    // 内部情報を更新
    layer.light = light;
};