import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryAreaScrollPointerMoveEventUseCase } from "./LibraryAreaScrollPointerMoveEventUseCase";
import { execute as libraryAreaScrollPointerUpEventUseCase } from "./LibraryAreaScrollPointerUpEventUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description ライブラリエリアのスクロールバーのマウスダウンイベント
 *              Mouse down event of the library area scrollbar
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return;
    }

    // メニューを非表示
    $allHideMenu();

    // 編集モードを終了
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // スクロールバーの移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        libraryAreaScrollPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        libraryAreaScrollPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        libraryAreaScrollPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        libraryAreaScrollPointerUpEventUseCase
    );
};