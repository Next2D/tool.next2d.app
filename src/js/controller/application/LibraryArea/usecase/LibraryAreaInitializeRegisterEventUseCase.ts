import { execute as libraryAreaPointerDownEventUseCase } from "./LibraryAreaPointerDownEventUseCase";
import { execute as libraryAreaDropUseCase } from "./LibraryAreaDropUseCase";
import { execute as libraryAreaDragoverService } from "../service/LibraryAreaDragoverService";
import { execute as libraryAreaRegisterWindowKeyEventUseCase } from "./LibraryAreaRegisterWindowKeyEventUseCase";
import { execute as libraryAreaRemoveWindowKeyEventUseCase } from "./LibraryAreaRemoveWindowKeyEventUseCase";
import { execute as libraryAreaScrollInitializeRegisterEventUseCase } from "@/controller/application/LibraryAreaScroll/usecase/LibraryAreaScrollInitializeRegisterEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";

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
    libraryAreaScrollInitializeRegisterEventUseCase();

    // リストボックス本体のイベント登録
    const listBoxElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (listBoxElement) {

        listBoxElement.addEventListener(EventType.POINTER_DOWN,
            libraryAreaPointerDownEventUseCase
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
            libraryAreaRegisterWindowKeyEventUseCase,
            { "passive": false }
        );

        // キーイベントの削除
        listBoxElement.addEventListener(EventType.POINTER_OUT,
            libraryAreaRemoveWindowKeyEventUseCase,
            { "passive": false }
        );
        listBoxElement.addEventListener(EventType.POINTER_LEAVE,
            libraryAreaRemoveWindowKeyEventUseCase,
            { "passive": false }
        );
    }
};