import { EventType } from "@/tool/domain/event/EventType";
import { execute as propertyAreaActiveWindowMoveService } from "../service/PropertyAreaActiveWindowMoveService";
import { execute as propertyAreaActiveWindowMouseUpUseCase } from "../usecase/PropertyAreaActiveWindowMouseUpUseCase";

/**
 * @description プロパティエリアの移動関数をwindowに登録
 *              Register property area move function to window
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 画面イベントを登録
    window.addEventListener(EventType.MOUSE_MOVE, propertyAreaActiveWindowMoveService);
    window.addEventListener(EventType.MOUSE_UP, propertyAreaActiveWindowMouseUpUseCase);
};