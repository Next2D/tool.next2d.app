import { execute as screenTabGetTextElementService } from "../service/ScreenTabGetTextElementService";
import { execute as screenTabInactiveStyleService } from "../service/ScreenTabInactiveStyleService";
import { execute as screenTabGetListElementService } from "../service/ScreenTabGetListElementService";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { $getWorkSpace, $setEditMode } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

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

    const name: string | null = element.textContent;
    if (!name) {
        element.textContent = "Untitled";
        return element.focus();
    }
    screenTabInactiveStyleService(element);

    const listElement: HTMLElement | null = screenTabGetListElementService(id);
    if (!listElement) {
        return ;
    }

    // リストの名前を更新
    listElement.textContent = name;

    const workSpace: WorkSpace | null = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    workSpace.name = name;

    const tabElement: HTMLElement | null = screenTabGetElementService(id);
    if (!tabElement) {
        return ;
    }

    // 移動を有効化
    tabElement.draggable = true;

    // 入力モードを終了
    $setEditMode(false);
};