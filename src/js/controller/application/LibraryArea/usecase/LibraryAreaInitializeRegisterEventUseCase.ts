import { execute as libraryAreaMouseDownEventUseCase } from "./LibraryAreaMouseDownEventUseCase";
import { execute as libraryAreaDropUseCase } from "./LibraryAreaDropUseCase";
import { execute as libraryAreaDragoverService } from "../service/LibraryAreaDragoverService";
import { execute as libraryAreaRegisterWindowKeyEventUseCase } from "./LibraryAreaRegisterWindowKeyEventUseCase";
import { execute as libraryAreaRemoveWindowKeyEventUseCase } from "./LibraryAreaRemoveWindowKeyEventUseCase";
import { execute as librayAreaWheelEventService } from "../../LibraryAreaScroll/service/LibrayAreaWheelEventService";
import { execute as libraryAreaScrollBarMouseDownEventUseCase } from "@/controller/application/LibraryAreaScroll/usecase/LibraryAreaScrollBarMouseDownEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";
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
        scrollBarElement.addEventListener(EventType.POINTER_DOWN,
            libraryAreaScrollBarMouseDownEventUseCase
        );
    }

    // リストボックス本体のイベント登録
    const listBoxElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (listBoxElement) {
        listBoxElement.addEventListener("wheel",
            librayAreaWheelEventService,
            { "passive": false }
        );

        listBoxElement.addEventListener(EventType.POINTER_DOWN,
            libraryAreaMouseDownEventUseCase
        );

        // drop系のイベントの登録
        listBoxElement.addEventListener("dragover",
            libraryAreaDragoverService,
            { "passive": false }
        );
        listBoxElement.addEventListener("drop",
            libraryAreaDropUseCase,
            { "passive": false }
        );

        // キーイベントの登録
        listBoxElement.addEventListener(EventType.POINTER_OVER,
            libraryAreaRegisterWindowKeyEventUseCase
        );

        // キーイベントの削除
        listBoxElement.addEventListener(EventType.POINTER_OUT,
            libraryAreaRemoveWindowKeyEventUseCase
        );
        listBoxElement.addEventListener(EventType.POINTER_LEAVE,
            libraryAreaRemoveWindowKeyEventUseCase
        );
    }
};