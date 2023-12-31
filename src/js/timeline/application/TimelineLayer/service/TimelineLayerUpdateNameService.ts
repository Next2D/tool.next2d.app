import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description Layerオブジェクトの名前を更新
 *              Update the name of the Layer object
 *
 * @param  {number} layer_id
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, name: string): void =>
{
    const scene = $getCurrentWorkSpace().scene;
    const layer: Layer | null = scene.getLayer(layer_id);
    if (!layer) {
        return ;
    }

    // 内部情報を更新
    layer.name = name;
};