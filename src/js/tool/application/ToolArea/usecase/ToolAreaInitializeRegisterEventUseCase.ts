import { EventType } from "../../../domain/event/EventType";
import { execute as toolAreaMouseMoveEventService } from "../service/ToolAreaMouseMoveEventService";
import { execute as toolAreaMouseDownEventUseCase } from "./ToolAreaMouseDownEventUseCase";
import { execute as toolAreaMouseUpEventUseCase } from "./ToolAreaMouseUpEventUseCase";
import { execute as toolAreaMouseOutEventService } from "../service/ToolAreaMouseOutEventService";

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
    element.addEventListener(EventType.MOUSE_DOWN, toolAreaMouseDownEventUseCase);

    // ツールエリア内でのマウス移動の処理
    element.addEventListener(EventType.MOUSE_MOVE, toolAreaMouseMoveEventService);

    // ツールエリア内でのマウスアップ処理
    element.addEventListener(EventType.MOUSE_UP, toolAreaMouseUpEventUseCase);

    // ツールエリア内でのマウスアウト処理
    element.addEventListener(EventType.MOUSE_OUT, toolAreaMouseOutEventService);
};