import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { execute as libraryMenuShowService } from "../service/LibraryMenuShowService";

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

    if (!element) {
        return ;
    }

    element.addEventListener("contextmenu", libraryMenuShowService);
};