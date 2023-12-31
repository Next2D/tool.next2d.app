import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getTopIndex } from "../../TimelineUtil";
import { execute as timelineLayerControllerNormalSelectUseCase } from "./TimelineLayerControllerNormalSelectUseCase";
import { Layer } from "@/core/domain/model/Layer";

/**
 * @description レイヤーのコントローラーエリアのマウスダウン処理関数
 *              Mouse down processing function for the controller area of a layer
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const index = $getTopIndex() + parseInt(element.dataset.layerIndex as string);
    const scene = $getCurrentWorkSpace().scene;
    const layer: Layer | undefined = scene.layers[index];
    if (!layer)  {
        return ;
    }

    switch (true) {

        case event.altKey:
        case event.shiftKey:
            break;

        default:
            timelineLayerControllerNormalSelectUseCase(layer.id);
            break;

    }
};