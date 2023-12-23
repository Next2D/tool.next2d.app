import { execute as timelineLayerFrameNormalSelectUseCase } from "./TimelineLayerFrameNormalSelectUseCase";

/**
 * @description フレームエリアのマウスダウンの実行関数
 *              Execution function of mouse down in frame area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // フレーム情報を更新してマーカーを移動
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    switch (true) {

        case event.altKey:
            break;

        case event.shiftKey:
            break;

        default:
            timelineLayerFrameNormalSelectUseCase(element);
            break;

    }
};