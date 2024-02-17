import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryMenuShowUseCase } from "./LibraryMenuShowUseCase";
import { execute as libraryMenuAddNewFolderMouseDownEventUseCase } from "./LibraryMenuAddNewFolderMouseDownEventUseCase";
import { execute as libraryMenuFileMouseDownEventUseCase } from "./LibraryMenuFileMouseDownEventUseCase";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_FOLDER_ADD_ID,
    $LIBRARY_FILE_ID
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
    // ライブラリエリアの右クリックイベントを追加
    const element: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (element) {
        element.addEventListener("contextmenu",
            libraryMenuShowUseCase
        );
    }

    // フォルダー追加のイベント登録
    const addFolderElement: HTMLElement | null = document
        .getElementById($LIBRARY_FOLDER_ADD_ID);

    if (addFolderElement) {
        addFolderElement.addEventListener(EventType.MOUSE_DOWN,
            libraryMenuAddNewFolderMouseDownEventUseCase
        );
    }

    // 外部ファイルの読込ボタンのイベント登録
    const fileElement: HTMLElement | null = document
        .getElementById($LIBRARY_FILE_ID);

    if (fileElement) {
        fileElement.addEventListener(EventType.MOUSE_DOWN,
            libraryMenuFileMouseDownEventUseCase
        );
    }
};