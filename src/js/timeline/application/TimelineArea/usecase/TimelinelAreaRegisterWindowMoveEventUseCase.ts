import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAreaActiveWindowMoveService } from "../service/TimelineAreaActiveWindowMoveService";
import { execute as timelineAreaActiveWindowMouseUpUseCase } from "./TimelineAreaActiveWindowMouseUpUseCase";

/**
 * @description タイムラインエリアの移動関数をwindowに登録
 *              Register timeline area move function in window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 画面イベントを登録
    window.addEventListener(EventType.MOUSE_MOVE, timelineAreaActiveWindowMoveService);
    window.addEventListener(EventType.MOUSE_UP, timelineAreaActiveWindowMouseUpUseCase);
};