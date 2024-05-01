import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageRectWindowMouseMoveEventUseCase } from "./StageRectWindowMouseMoveEventUseCase";

/**
 * @description 範囲選択のマウスアップイベントの実行関数
 *              Execution function of the mouse-up event of the range selection
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を停止
    event.stopPropagation();
    event.preventDefault();

    // windowイベントを解除
    window.removeEventListener(EventType.MOUSE_MOVE, stageRectWindowMouseMoveEventUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};