import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as pluginAreaScrollPointerMoveUseCase } from "./PluginAreaScrollPointerMoveUseCase";
import { execute as pluginAreaScrollPointerUpUseCase } from "./PluginAreaScrollPointerUpUseCase";

/**
 * @description プラグインエリアのスクロールバーのマウスダウンイベント
 *              Plugin area scrollbar mouse down event
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

    // イベントの伝播を止める
    event.stopPropagation();

    // メニューを非表示にする
    $allHideMenu();

    // ポインターイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        pluginAreaScrollPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        pluginAreaScrollPointerUpUseCase,
        { "passive": false }
    );
};