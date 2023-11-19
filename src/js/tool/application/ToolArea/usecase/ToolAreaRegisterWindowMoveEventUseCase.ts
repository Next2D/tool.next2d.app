import { EventType } from "@/tool/domain/event/EventType";
import { execute as toolAreaActiveWindowMoveService } from "../service/ToolAreaActiveWindowMoveService";
import { execute as toolAreaActiveWindowMouseUpUseCase } from "./ToolAreaActiveWindowMouseUpUseCase";

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
    window.addEventListener(EventType.MOUSE_MOVE, toolAreaActiveWindowMoveService);
    window.addEventListener(EventType.MOUSE_UP, toolAreaActiveWindowMouseUpUseCase);
};