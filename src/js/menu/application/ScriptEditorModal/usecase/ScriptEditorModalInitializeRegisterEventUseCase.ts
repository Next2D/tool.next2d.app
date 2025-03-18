import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptEditorModalHideIconPointerDownUseCase } from "./ScriptEditorModalHideIconPointerDownUseCase";
import { execute as scriptEditorModalPointerDownEventUseCase } from "./ScriptEditorModalPointerDownEventUseCase";
import { $getAceEditor } from "../ScriptEditorModalUtil";
import {
    $SCRIPT_EDITOR_MODAL_ID,
    $SCRIPT_EDITOR_HIDE_ICON_ID,
    $SCRIPT_EDITOR_BAR_ID
} from "@/config/ScriptEditorModalConfig";

/**
 * @description スクリプトエディタの初期起動ユースケース
 *              Script Editor Initial Launch Use Case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const modalElement: HTMLElement | null = document
        .getElementById($SCRIPT_EDITOR_MODAL_ID);

    if (modalElement) {
        // 中央表示
        modalElement.style.top  = `${(window.innerHeight - modalElement.clientHeight) / 2}px`;
        modalElement.style.left = `${(window.innerWidth  - modalElement.clientWidth)  / 2}px`;

        const style = document
            .documentElement
            .style;

        //要素のリサイズイベント取得
        const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void =>
        {
            requestAnimationFrame((): void =>
            {
                entries.forEach((entry: ResizeObserverEntry) =>
                {
                    const element = entry.target as HTMLElement;
                    style.setProperty("--script-modal-width",  `${element.clientWidth}px`);
                    style.setProperty("--script-modal-height", `${element.clientHeight}px`);
                });

                $getAceEditor().resize(true);
            });
        });

        resizeObserver.observe(modalElement);
    }

    // 閉じるボタンのイベントを登録
    const hideIconElement: HTMLElement | null = document
        .getElementById($SCRIPT_EDITOR_HIDE_ICON_ID);

    if (hideIconElement) {
        hideIconElement.addEventListener(EventType.POINTER_DOWN,
            scriptEditorModalHideIconPointerDownUseCase
        );
    }

    const barElement: HTMLElement | null = document
        .getElementById($SCRIPT_EDITOR_BAR_ID);

    if (barElement) {
        barElement.addEventListener(EventType.POINTER_DOWN,
            scriptEditorModalPointerDownEventUseCase
        );
    }
};