import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description タイムラインのレイヤーのハイライトカラーを生成して返却
 *
 * @param  {string} color
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, color: string): void =>
{
    const layer: Layer | null = $getCurrentWorkSpace()
        .scene
        .getLayer(layer_id);

    if (!layer) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById(`layer-light-icon-${layer_id}`);

    if (!element) {
        return ;
    }

    // update property
    layer.color = color;

    const colorElement = element.children[0] as NonNullable<HTMLElement>;
    colorElement.style.backgroundColor = color;
};