import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as historyAreaScrollPointerMoveUseCase } from "./HistoryAreaScrollPointerMoveUseCase";
import { execute as historyAreaScrollPointerUpUseCase } from "./HistoryAreaScrollPointerUpUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description 履歴エリアのスクロールバーのマウスダウンイベント
 *              Mouse down event of the history area scroll bar
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

    // ポインターイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        historyAreaScrollPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        historyAreaScrollPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        historyAreaScrollPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        historyAreaScrollPointerUpUseCase
    );
};