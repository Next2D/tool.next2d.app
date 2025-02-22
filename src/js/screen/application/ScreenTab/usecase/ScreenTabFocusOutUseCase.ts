import { execute as screenTabGetTextElementService } from "../service/ScreenTabGetTextElementService";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { execute as screenTabInactiveStyleService } from "../service/ScreenTabInactiveStyleService";
import { execute as externalWorkSpaceUpdateNameUseCase } from "@/external/core/application/ExternalWorkSpace/usecase/ExternalWorkSpaceUpdateNameUseCase";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $getWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 編集モード終了処理
 *              Edit Mode Exit Processing
 *
 * @params {Event} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: Event): Promise<void> =>
{
    // 親のイベントを終了
    event.stopPropagation();

    // キーロックを解除
    $updateKeyLock(false);

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const tabId = parseInt(element.dataset.tabId as string);
    const workSpace = $getWorkSpace(tabId);
    if (!workSpace) {
        return ;
    }

    const textElement = screenTabGetTextElementService(tabId);
    if (!textElement) {
        return ;
    }

    const name: string | null = textElement.textContent;
    if (!name) {
        textElement.textContent = "Untitled";
        return textElement.focus();
    }

    const tabElement = screenTabGetElementService(workSpace.id);
    if (!tabElement) {
        return ;
    }

    // styleを更新して入力モードを停止
    screenTabInactiveStyleService(textElement, tabElement);

    // タブ名を変更
    await externalWorkSpaceUpdateNameUseCase(workSpace, name);
};