import { $HISTORY_LIST_ID } from "@/config/HistoryConfig";
import { execute as historyListComponent } from "@/controller/application/HistoryArea/component/HistoryListComponent";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as historyMouseDownEventUseCase } from "./HistoryPointerDownEventUseCase";
import { execute as languageTranslationService } from "@/language/application/service/LanguageTranslationService";
import { execute as historyAreaScrollUpdateHeightService } from "@/controller/application/HistoryAreaScroll/service/HistoryAreaScrollUpdateHeightService";

/**
 * @type {Promise}
 * @private
 */
let $pointerDownQueue: Promise<void> = Promise.resolve();

/**
 * @description 作業履歴のリストにElementを追加
 *              Add Element to the list of work history
 *
 * @param  {number} movie_clip_id
 * @param  {number} index
 * @param  {string} text
 * @param  {string} [class_name=""]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip_id: number,
    index: number,
    text: string,
    class_name: "" | "disable" = "",
    ...values: Array<string | number>
): void => {

    const element: HTMLElement | null = document
        .getElementById($HISTORY_LIST_ID);

    if (!element) {
        return ;
    }

    element.insertAdjacentHTML("beforeend",
        historyListComponent(movie_clip_id, index, text, ...values)
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
    lastElement.addEventListener(EventType.POINTER_DOWN, async (event: PointerEvent): Promise<void> =>
    {
        $pointerDownQueue = $pointerDownQueue
            .then(() => historyMouseDownEventUseCase(event));
    });

    // 履歴の高さを更新
    historyAreaScrollUpdateHeightService();
};