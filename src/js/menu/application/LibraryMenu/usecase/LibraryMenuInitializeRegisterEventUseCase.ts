import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryMenuShowService } from "../service/LibraryMenuShowService";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_FOLDER_ADD_ID
} from "@/config/LibraryConfig";

/**
 * @description ライブラリメニューの初期起動時のイベント登録
 *              Event registration at initial startup of library menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (element) {
        element.addEventListener("contextmenu", 
            libraryMenuShowService
        );
    }

    const addFolderElement: HTMLElement | null = document
        .getElementById($LIBRARY_FOLDER_ADD_ID);

    if (addFolderElement) {
        addFolderElement.addEventListener(EventType.MOUSE_DOWN,
            libraryMenuShowService
        );
    }
};