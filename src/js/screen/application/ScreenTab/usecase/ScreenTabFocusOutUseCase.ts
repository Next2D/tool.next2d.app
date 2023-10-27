import { execute as screenTabGetTextElementService } from "../service/ScreenTabGetTextElementService";
import { execute as screenTabInactiveStyleService } from "../service/ScreenTabInactiveStyleService";
import { execute as screenTabGetListElementService } from "../service/ScreenTabGetListElementService";

/**
 * @description 編集モード終了処理
 *              Edit Mode Exit Processing
 *
 * @params {Event} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    if (!event.target) {
        return ;
    }

    const id: number = parseInt((event.target as HTMLElement).dataset.tabId as string);

    const element: HTMLElement | null = screenTabGetTextElementService(id);
    if (!element) {
        return ;
    }

    screenTabInactiveStyleService(element);

    const listElement: HTMLElement | null = screenTabGetListElementService(id);
    if (!listElement) {
        return ;
    }

    listElement.textContent = element.textContent;
};