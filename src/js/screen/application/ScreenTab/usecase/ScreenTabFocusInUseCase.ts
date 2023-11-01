import { $setEditMode } from "../../../../controller/core/application/CoreUtil";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";

/**
 * @description 編集モード開始処理
 *              Edit mode start processing
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

    const element: HTMLElement = event.currentTarget as HTMLElement;
    const id: number = parseInt(element.dataset.tabId as string);

    const tabElement: HTMLElement | null = screenTabGetElementService(id);
    if (!tabElement) {
        return ;
    }

    // 移動を無効化
    tabElement.draggable = false;

    // 入力モードをtrueに更新
    $setEditMode(true);
};