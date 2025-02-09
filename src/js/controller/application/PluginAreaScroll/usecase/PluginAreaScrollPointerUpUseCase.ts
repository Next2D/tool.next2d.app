import { EventType } from "@/tool/domain/event/EventType";
import { execute as pluginAreaScrollPointerMoveUseCase } from "./PluginAreaScrollPointerMoveUseCase";

/**
 * @description プラグインエリアのスクロールバーのマウスアップイベント
 *              Plugin area scrollbar mouse up event
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

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 登録したポインターイベントを解放
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, pluginAreaScrollPointerMoveUseCase);
    element.removeEventListener(EventType.POINTER_UP, execute);
};