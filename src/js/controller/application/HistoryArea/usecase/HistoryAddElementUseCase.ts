import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";
import { execute as historyListComponent } from "@/controller/application/HistoryArea/component/HistoryListComponent";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as historyMouseDownEventUseCase } from "./HistoryMouseDownEventUseCase";
import { execute as languageTranslationService } from "@/language/application/service/LanguageTranslationService";

/**
 * @description 作業履歴のリストにElementを追加
 *              Add Element to the list of work history
 *
 * @param  {number} index
 * @param  {string} text
 * @param  {string} class_name
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    index: number,
    text: string,
    class_name: "" | "disable" = ""
): void => {

    const element: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!element) {
        return ;
    }

    element.insertAdjacentHTML("beforeend",
        historyListComponent(index, text)
    );

    const lastElement = element.lastElementChild as NonNullable<HTMLElement>;
    if (!lastElement) {
        return ;
    }

    if (class_name) {
        lastElement.setAttribute("class", class_name);
    }

    // 言語設定
    languageTranslationService(lastElement);

    // マウスダウンイベントを登録
    lastElement.addEventListener(EventType.MOUSE_DOWN,
        historyMouseDownEventUseCase
    );
};