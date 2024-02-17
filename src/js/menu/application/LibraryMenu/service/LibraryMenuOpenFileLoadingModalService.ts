import { $LIBRARY_FILE_INPUT_ID } from "@/config/LibraryConfig";
import { $allHideMenu } from "../../MenuUtil";

/**
 * @description 外部ファイル読込の画面を起動
 *              Launch the external file loading screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($LIBRARY_FILE_INPUT_ID);

    if (!element) {
        return ;
    }

    // メニューを全て閉じる
    $allHideMenu();

    element.click();
};