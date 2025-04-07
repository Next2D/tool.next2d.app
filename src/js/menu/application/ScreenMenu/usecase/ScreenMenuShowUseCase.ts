import type { ScreenMenu } from "@/menu/domain/model/ScreenMenu";
import { $SCREEN_MENU_NAME } from "@/config/MenuConfig";
import { $allHideMenu, $getMenu } from "@/menu/application/MenuUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";

/**
 * @description スクリーンエリアのメニューを表示
 *              Show screen area menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: MouseEvent): void =>
{
    if ($useKeyboard()) {
        return ;
    }

    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    // 編集中のElementを初期化
    $setEditingElement(null);

    // スクリーンメニュー以外、全て非表示にする
    $allHideMenu($SCREEN_MENU_NAME);

    // 進行状況メニューを非表示に
    const menu = $getMenu<ScreenMenu>($SCREEN_MENU_NAME);
    if (!menu) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_MENU_NAME);

    if (!element) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const clientHeight: number = element.clientHeight;

    const height: number = clientHeight / 2;
    let top: number = event.pageY - height;
    if (0 > top) {
        top = 15;
    }

    if (event.pageY + height > window.innerHeight) {
        top = window.innerHeight - clientHeight - 15;
    }

    menu.offsetLeft = event.pageX + 15;
    menu.offsetTop  = top;

    menu.show();
};