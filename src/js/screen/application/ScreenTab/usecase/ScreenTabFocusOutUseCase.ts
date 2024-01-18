import { execute as screenTabGetTextElementService } from "../service/ScreenTabGetTextElementService";
import { execute as screenTabInactiveStyleService } from "../service/ScreenTabInactiveStyleService";
import { execute as screenTabGetListElementService } from "../service/ScreenTabGetListElementService";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { execute as workSpaceUpdateNameUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceUpdateNameUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";
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
    const workSpace: WorkSpace | null = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const textElement: HTMLElement | null = screenTabGetTextElementService(id);
    if (!textElement) {
        return ;
    }

    const name: string | null = textElement.textContent;
    if (!name) {
        textElement.textContent = "Untitled";
        return textElement.focus();
    }

    const tabElement: HTMLElement | null = screenTabGetElementService(id);
    if (!tabElement) {
        return ;
    }

    const listElement: HTMLElement | null = screenTabGetListElementService(id);
    if (!listElement) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();

    // styleの更新
    screenTabInactiveStyleService(textElement, tabElement);

    // 移動を有効化
    tabElement.draggable = true;

    // 修正がなければ終了
    if (name === workSpace.name) {
        return ;
    }

    // リストの名前を更新
    listElement.textContent = name;

    // WorkSpaceの名前を更新
    workSpaceUpdateNameUseCase(id, name);
};