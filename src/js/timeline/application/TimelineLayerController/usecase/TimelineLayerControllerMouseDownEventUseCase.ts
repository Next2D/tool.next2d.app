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
    const targetElement: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!targetElement) {
        return ;
    }

    const layerId = parseInt(targetElement.dataset.layerId as NonNullable<string>);

    switch (true) {

        case event.altKey:
        case event.shiftKey:
            break;

        default:
            timelineLayerControllerNormalSelectUseCase(layerId);
            break;

    }
};