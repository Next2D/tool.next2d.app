import { EventType } from "@/tool/domain/event/EventType";
import { execute as arrowToolStageRectPointerMoveEventUseCase } from "./ArrowToolStageRectPointerMoveEventUseCase";
import { execute as arrowToolStageRectPointerUpEventUseCase } from "./ArrowToolStageRectPointerUpEventUseCase";

/**
 * @description 範囲選択のマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the range selection
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // windowイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(EventType.POINTER_MOVE,
        arrowToolStageRectPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(EventType.POINTER_UP,
        arrowToolStageRectPointerUpEventUseCase
    );
    element.addEventListener(EventType.POINTER_CANCEL,
        arrowToolStageRectPointerUpEventUseCase
    );
};