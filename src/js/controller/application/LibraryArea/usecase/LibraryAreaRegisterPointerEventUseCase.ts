import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryAreaPointerMoveEventUseCase } from "./LibraryAreaPointerMoveEventUseCase";
import { execute as libraryAreaPointerUpEventUseCase } from "./LibraryAreaPointerUpEventUseCase";
import { execute as screenAreaLibraryItemDropStartService } from "@/screen/application/ScreenArea/service/ScreenAreaLibraryItemDropStartService";
import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import {
    $setMoveOffsetX,
    $setMoveOffsetY
} from "../LibraryAreaUtil";

/**
 * @description スクリーンエリアの移動イベントを登録
 *              Register move events for screen area
 *
 * @param  {PointerEvent} event
 * @param  {HTMLElement} item_element
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent, item_element: HTMLElement): void =>
{
    if (event.button !== 0
        || $useKeyboard()
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const libraryListBox = document.getElementById($LIBRARY_LIST_BOX_ID);
    if (!libraryListBox) {
        return ;
    }

    // スクリーン以外のelementのイベントを無効化
    screenAreaLibraryItemDropStartService();

    const offsetX = event.offsetX
        + (element.offsetLeft - libraryListBox.offsetLeft)
        - (item_element.offsetLeft - libraryListBox.offsetLeft);

    const offsetY = event.offsetY
        + (element.offsetTop - libraryListBox.offsetTop)
        - (item_element.offsetTop - libraryListBox.offsetTop);

    // 初期値をセット
    $setMoveOffsetX(offsetX);
    $setMoveOffsetY(offsetY);

    item_element.setPointerCapture(event.pointerId);
    item_element.addEventListener(
        EventType.POINTER_MOVE,
        libraryAreaPointerMoveEventUseCase,
        { "passive": false }
    );
    item_element.addEventListener(
        EventType.POINTER_UP,
        libraryAreaPointerUpEventUseCase,
        { "passive": false }
    );
    item_element.addEventListener(
        EventType.POINTER_CANCEL,
        libraryAreaPointerUpEventUseCase,
        { "passive": false }
    );
};