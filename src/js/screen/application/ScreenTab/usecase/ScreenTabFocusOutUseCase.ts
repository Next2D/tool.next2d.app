import { execute as screenTabGetTextElementService } from "../service/ScreenTabGetTextElementService";
import { execute as screenTabInactiveStyleService } from "../service/ScreenTabInactiveStyleService";
import { execute as screenTabGetListElementService } from "../service/ScreenTabGetListElementService";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { $getWorkSpace, $setEditMode } from "@/core/application/CoreUtil";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

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

    const textElement: HTMLElement | null = screenTabGetTextElementService(id);
    if (!textElement) {
        return ;
    }

    const tabElement: HTMLElement | null = screenTabGetElementService(id);
    if (!tabElement) {
        return ;
    }

    const listElement: HTMLElement | null = screenTabGetListElementService(id);
    if (!listElement) {
        return ;
    }

    const name: string | null = textElement.textContent;
    if (!name) {
        textElement.textContent = "Untitled";
        return textElement.focus();
    }

    const workSpace: WorkSpace | null = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();

    // styleの更新
    screenTabInactiveStyleService(textElement, tabElement);

    // リストの名前を更新
    workSpace.name = listElement.textContent = name;

    // 移動を有効化
    tabElement.draggable = true;
};