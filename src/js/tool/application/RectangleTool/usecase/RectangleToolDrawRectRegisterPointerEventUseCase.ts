import { EventType } from "@/tool/domain/event/EventType";
import { execute as rectangleToolDrawRectPointerMoveEventUseCase } from "./RectangleToolDrawRectPointerMoveEventUseCase";
import { execute as rectangleToolDrawRectPointerUpEventUseCase } from "./RectangleToolDrawRectPointerUpEventUseCase";

/**
 * @description 拡大の範囲選択のマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the range selection of the zoom
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        rectangleToolDrawRectPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        rectangleToolDrawRectPointerUpEventUseCase,
        { "passive": false }
    );
};