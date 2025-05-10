import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as pluginAreaScrollPointerMoveUseCase } from "./PluginAreaScrollPointerMoveUseCase";
import { execute as pluginAreaScrollPointerUpUseCase } from "./PluginAreaScrollPointerUpUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

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

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // ポインターイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        pluginAreaScrollPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        pluginAreaScrollPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        pluginAreaScrollPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        pluginAreaScrollPointerUpUseCase
    );
};