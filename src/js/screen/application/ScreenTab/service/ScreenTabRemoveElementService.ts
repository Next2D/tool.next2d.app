import { execute as screenTabGetElementService } from "./ScreenTabGetElementService";
import { execute as screenTabGetListElementService } from "./ScreenTabGetListElementService";

/**
 * @description 指定IDのタブを削除する
 *              Delete tab with specified ID
 *
 * @params {number} id
 * @return {void}
 * @method
 * @public
 */
export const execute = (id: number): void =>
{
    const tabElement: HTMLElement | null = screenTabGetElementService(id);
    if (tabElement) {
        tabElement.remove();
    }

    const listElement: HTMLElement | null = screenTabGetListElementService(id);
    if (listElement) {
        listElement.remove();
    }
};