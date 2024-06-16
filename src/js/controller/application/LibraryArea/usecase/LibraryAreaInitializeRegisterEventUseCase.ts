import { execute as libraryAreaMouseDownEventUseCase } from "./LibraryAreaMouseDownEventUseCase";
import { execute as libraryAreaDropUseCase } from "./LibraryAreaDropUseCase";
import { execute as libraryAreaDragoverService } from "../service/LibraryAreaDragoverService";
import { execute as libraryAreaRegisterWindowKeyEventUseCase } from "./LibraryAreaRegisterWindowKeyEventUseCase";
import { execute as libraryAreaRemoveWindowKeyEventUseCase } from "./LibraryAreaRemoveWindowKeyEventUseCase";
import { execute as libraryAreaDragstartUseCase } from "./LibraryAreaDragstartUseCase";
import { execute as libraryAreaDragendUseCase } from "./LibraryAreaDragendUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as librayAreaWheelEventUseCase } from "./LibrayAreaWheelEventUseCase";
import { execute as libraryAreaScrollBarMouseDownEventUseCase } from "./LibraryAreaScrollBarMouseDownEventUseCase";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_LIST_BOX_SCROLL_BAR_ID
} from "@/config/LibraryConfig";

/**
 * @description ライブラリエリアのイベントを登録
 *              Register an event in the library area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // スクロールバーのイベント登録
    const scrollBarElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_SCROLL_BAR_ID);

    if (scrollBarElement) {
        scrollBarElement.addEventListener(EventType.MOUSE_DOWN,
            libraryAreaScrollBarMouseDownEventUseCase
        );
    }

    // リストボックス本体のイベント登録
    const listBoxElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (listBoxElement) {
        listBoxElement.addEventListener("wheel",
            librayAreaWheelEventUseCase,
            { "passive": false }
        );

        listBoxElement.addEventListener(EventType.MOUSE_DOWN,
            libraryAreaMouseDownEventUseCase
        );

        // drop系のイベントの登録
        listBoxElement.addEventListener("dragover", libraryAreaDragoverService);
        listBoxElement.addEventListener("drop", libraryAreaDropUseCase);
        listBoxElement.addEventListener("dragstart", libraryAreaDragstartUseCase);
        listBoxElement.addEventListener("dragend", libraryAreaDragendUseCase);

        // キーイベントの登録
        listBoxElement.addEventListener(EventType.MOUSE_OVER,
            libraryAreaRegisterWindowKeyEventUseCase
        );

        // キーイベントの削除
        listBoxElement.addEventListener(EventType.MOUSE_OUT,
            libraryAreaRemoveWindowKeyEventUseCase
        );
        listBoxElement.addEventListener(EventType.MOUSE_LEAVE,
            libraryAreaRemoveWindowKeyEventUseCase
        );
    }
};