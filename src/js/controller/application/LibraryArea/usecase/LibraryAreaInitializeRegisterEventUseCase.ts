import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { execute as libraryAreaMouseDownEventUseCase } from "./LibraryAreaMouseDownEventUseCase";
import { execute as libraryAreaDropUseCase } from "./LibraryAreaDropUseCase";
import { execute as libraryAreaDragoverService } from "../service/LibraryAreaDragoverService";
import { execute as libraryAreaRegisterWindowKeyEventUseCase } from "./LibraryAreaRegisterWindowKeyEventUseCase";
import { execute as libraryAreaRemoveWindowKeyEventUseCase } from "./LibraryAreaRemoveWindowKeyEventUseCase";
import { execute as libraryAreaDragstartUseCase } from "./LibraryAreaDragstartUseCase";
import { execute as libraryAreaDragendUseCase } from "./LibraryAreaDragendUseCase";
import { EventType } from "@/tool/domain/event/EventType";

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
    const element: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.MOUSE_DOWN,
        libraryAreaMouseDownEventUseCase
    );

    // drop系のイベントの登録
    element.addEventListener("dragover", libraryAreaDragoverService);
    element.addEventListener("drop", libraryAreaDropUseCase);
    element.addEventListener("dragstart", libraryAreaDragstartUseCase);
    element.addEventListener("dragend", libraryAreaDragendUseCase);

    // キーイベントの登録
    element.addEventListener(EventType.MOUSE_OVER,
        libraryAreaRegisterWindowKeyEventUseCase
    );

    // キーイベントの削除
    element.addEventListener(EventType.MOUSE_OUT,
        libraryAreaRemoveWindowKeyEventUseCase
    );
    element.addEventListener(EventType.MOUSE_LEAVE,
        libraryAreaRemoveWindowKeyEventUseCase
    );
};