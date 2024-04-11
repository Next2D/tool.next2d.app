import { execute as screenTabGetTextElementService } from "../service/ScreenTabGetTextElementService";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { execute as screenTabInactiveStyleService } from "../service/ScreenTabInactiveStyleService";
import { execute as externalWorkSpaceUpdateNameUseCase } from "@/external/core/application/ExternalWorkSpace/usecase/ExternalWorkSpaceUpdateNameUseCase";

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
    // 親のイベントを終了
    event.stopPropagation();

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

    const tabElement: HTMLElement | null = screenTabGetElementService(workSpace.id);
    if (!tabElement) {
        return ;
    }

    // styleを更新して入力モードを停止
    screenTabInactiveStyleService(textElement, tabElement);

    // タブ名を変更
    externalWorkSpaceUpdateNameUseCase(workSpace, name);
};