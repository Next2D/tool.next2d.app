import type { ScreenTabMenu } from "@/menu/domain/model/ScreenTabMenu";
import { $SCREEN_TAB_MENU_NAME } from "@/config/MenuConfig";
import { $SCREEN_TAB_LIST_ID } from "@/config/ScreenConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { $getMenu } from "@/menu/application/MenuUtil";
import { execute as screenTabMenuMouseDownEventUseCase } from "./ScreenTabMenuMouseDownEventUseCase";

/**
 * @description 初期起動のユースケース
 *              Initial startup use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_TAB_LIST_ID);

    if (!element) {
        return ;
    }

    const menu = $getMenu<ScreenTabMenu>($SCREEN_TAB_MENU_NAME);
    if (!menu) {
        return ;
    }

    menu.offsetLeft = element.offsetLeft + element.offsetWidth;
    menu.offsetTop  = element.offsetTop  + 25;

    element.addEventListener(EventType.POINTER_DOWN,
        screenTabMenuMouseDownEventUseCase
    );
};