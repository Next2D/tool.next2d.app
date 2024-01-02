import { $getLayerFromElement } from "../../TimelineUtil";
import { execute as timelineLayerControllerNormalSelectUseCase } from "./TimelineLayerControllerNormalSelectUseCase";

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

    // 指定のLayerオブジェクトを取得
    const layer = $getLayerFromElement(element);
    if (!layer) {
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