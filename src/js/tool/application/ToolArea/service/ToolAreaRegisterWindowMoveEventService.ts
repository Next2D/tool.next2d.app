import { EventType } from "../../../domain/event/EventType";
import { execute as toolAreaActiveMoveService } from "../service/ToolAreaActiveMoveService";
import { execute as toolAreaMouseMoveUpService } from "../service/ToolAreaMouseMoveUpService";

/**
 * @description ツールエリアの移動関数をwindowに登録
 *              Register tool area move function in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 画面イベントを登録
    window.addEventListener(EventType.MOUSE_MOVE, toolAreaActiveMoveService);
    window.addEventListener(EventType.MOUSE_UP, toolAreaMouseMoveUpService);
};