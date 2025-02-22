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
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const tabElement = screenTabGetElementService(
        parseInt(element.dataset.tabId as string)
    );
    if (!tabElement) {
        return ;
    }

    // 移動を無効化
    tabElement.draggable = false;
};