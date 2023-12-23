import { execute as timelineLayerNormalSelectElementUseCase } from "./TimelineLayerNormalSelectElementUseCase";

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
    // 親のイベントを中止
    event.stopPropagation();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    switch (true) {

        case event.altKey:
            break;

        case event.shiftKey:
            break;

        default:
            timelineLayerNormalSelectElementUseCase(element);
            break;
    }
};