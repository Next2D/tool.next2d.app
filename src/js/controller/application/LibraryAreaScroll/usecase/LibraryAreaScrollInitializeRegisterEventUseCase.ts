import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryAreaScrollPointerDownEventUseCase } from "./LibraryAreaScrollPointerDownEventUseCase";
import { execute as libraryAreaScrollWheelEventService } from "../service/LibraryAreaScrollWheelEventService";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_LIST_BOX_SCROLL_BAR_ID
} from "@/config/LibraryConfig";

/**
 * @description ライブラリエリアのスクロールイベントを登録
 *              Register the scroll event in the library area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scrollBarElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_SCROLL_BAR_ID);

    // マウスダウンイベントを登録
    if (scrollBarElement) {
        scrollBarElement.addEventListener(EventType.POINTER_DOWN,
            libraryAreaScrollPointerDownEventUseCase,
            { "passive": false }
        );
    }

    const listElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (listElement) {
        listElement.addEventListener("wheel",
            libraryAreaScrollWheelEventService,
            { "passive": false }
        );
    }
};