import { $SCREEN_MENU_NAME } from "@/config/MenuConfig";
import { $allHideMenu } from "../../MenuUtil";

/**
 * @description スクリーンエリアのサブメニューを全て非表示にする
 *              Hide all submenus in the screen area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // スクリーンメニュー以外、全て非表示にする
    $allHideMenu($SCREEN_MENU_NAME);
};