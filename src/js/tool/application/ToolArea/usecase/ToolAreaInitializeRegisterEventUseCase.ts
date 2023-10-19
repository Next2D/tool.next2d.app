import { EventType } from "../../../domain/event/EventType";
import { $setStandbyMoveState } from "../../ToolUtil";
import { execute as toolAreaMouseMoveEventService } from "../service/ToolAreaMouseMoveEventService";
import { execute as toolAreaMouseDownEventUseCase } from "./ToolAreaMouseDownEventUseCase";
import { execute as toolAreaMouseUpEventUseCase } from "./ToolAreaMouseUpEventUseCase";

/**
 * @description ツールエリアの初期起動時のイベント登録
 *              Registration of events at initial startup of the tool area
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // ツールエリア内でのマウス移動の処理
    element.addEventListener(EventType.MOUSE_DOWN, (): void =>
    {
        toolAreaMouseDownEventUseCase();
    });

    // ツールエリア内でのマウス移動の処理
    element.addEventListener(EventType.MOUSE_MOVE, (event: PointerEvent): void =>
    {
        toolAreaMouseMoveEventService(event);
    });

    // ツールエリア内でのマウスアップ処理
    element.addEventListener(EventType.MOUSE_UP, (event: PointerEvent): void =>
    {
        toolAreaMouseUpEventUseCase(event);
    });

    // ツールエリア内でのマウスアップ処理
    element.addEventListener(EventType.MOUSE_OUT, (event: PointerEvent): void =>
    {
        event.stopPropagation();
        $setStandbyMoveState(false);
    });
};