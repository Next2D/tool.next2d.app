import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryMenuShowUseCase } from "./LibraryMenuShowUseCase";
import { execute as libraryMenuAddNewFolderMouseDownEventUseCase } from "./LibraryMenuAddNewFolderMouseDownEventUseCase";
import { execute as libraryMenuAddNewMovieClipMouseDownEventUseCase } from "./LibraryMenuAddNewMovieClipMouseDownEventUseCase";
import { execute as libraryMenuFileMouseDownEventUseCase } from "./LibraryMenuFileMouseDownEventUseCase";
import { execute as libraryMenuLoadFileUseCase } from "./LibraryMenuLoadFileUseCase";
import { execute as libraryMenuEditMovieClipMouseDownEventUseCase } from "./LibraryMenuEditMovieClipMouseDownEventUseCase";
import { execute as libraryAreaRemoveInstanceUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaRemoveInstanceUseCase";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_FOLDER_ADD_ID,
    $LIBRARY_FILE_ID,
    $LIBRARY_FILE_INPUT_ID,
    $LIBRARY_MOVIE_CLIP_ADD_ID,
    $LIBRARY_CHANGE_SCENE_ID,
    $LIBRARY_DELETE_ID
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

    // MovieClip追加のイベント登録
    const addMovieClipElement: HTMLElement | null = document
        .getElementById($LIBRARY_MOVIE_CLIP_ADD_ID);

    if (addMovieClipElement) {
        addMovieClipElement.addEventListener(EventType.MOUSE_DOWN,
            libraryMenuAddNewMovieClipMouseDownEventUseCase
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

    // 外部ファイルの読込処理イベントを登録
    const fileInputElement: HTMLElement | null = document
        .getElementById($LIBRARY_FILE_INPUT_ID);

    if (fileInputElement) {
        fileInputElement.addEventListener("change",
            libraryMenuLoadFileUseCase
        );
    }

    // MovieClip編集ボタンのイベント登録
    const editMovieClipElement: HTMLElement | null = document
        .getElementById($LIBRARY_CHANGE_SCENE_ID);

    if (editMovieClipElement) {
        editMovieClipElement.addEventListener(EventType.MOUSE_DOWN,
            libraryMenuEditMovieClipMouseDownEventUseCase
        );
    }

    // 削除ボタンのイベント登録
    const deleteElement: HTMLElement | null = document
        .getElementById($LIBRARY_DELETE_ID);

    if (deleteElement) {
        deleteElement.addEventListener(EventType.MOUSE_DOWN,
            libraryAreaRemoveInstanceUseCase
        );
    }
};