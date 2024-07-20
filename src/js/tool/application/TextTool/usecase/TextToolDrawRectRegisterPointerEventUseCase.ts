import { EventType } from "@/tool/domain/event/EventType";
import { execute as textToolDrawRectPointerMoveEventUseCase } from "./TextToolDrawRectPointerMoveEventUseCase";
import { execute as textToolDrawRectPointerUpEventUseCase } from "./TextToolDrawRectPointerUpEventUseCase";

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
        EventType.MOUSE_MOVE,
        textToolDrawRectPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        textToolDrawRectPointerUpEventUseCase,
        { "passive": false }
    );
};