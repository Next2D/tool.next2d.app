import { execute as timelineLayerFrameExecuteMouseMoveUseCase } from "./TimelineLayerFrameExecuteMouseMoveUseCase";

/**
 * @description マウスでの複数フレーム選択処理関数
 *              Multiple frame selection processing function with mouse
 *
 * @param {PointerEvent} event
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        // 複数選択を実行
        timelineLayerFrameExecuteMouseMoveUseCase(element);
    });
};