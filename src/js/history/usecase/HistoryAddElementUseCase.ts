import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyListComponent } from "@/history/component/HistoryListComponent";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as historyMouseDownEventUseCase } from "./HistoryMouseDownEventUseCase";
import { execute as languageTranslationService } from "@/language/application/service/LanguageTranslationService";

/**
 * @description 作業履歴のリストにElementを追加
 *              Add Element to the list of work history
 *
 * @param  {string} text
 * @return {void}
 * @method
 * @public
 */
export const execute = (text: string): void =>
{
    const element: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();

    element.insertAdjacentHTML("beforeend",
        historyListComponent(workSpace.historyIndex, text)
    );

    const lastElement = element.lastElementChild as NonNullable<HTMLElement>;
    if (!lastElement) {
        return ;
    }

    // 言語設定
    languageTranslationService(lastElement);

    lastElement.addEventListener(EventType.MOUSE_DOWN, historyMouseDownEventUseCase);
};