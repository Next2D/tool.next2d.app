import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptEditorModalHideIconMouseDownUseCase } from "./ScriptEditorModalHideIconMouseDownUseCase";
import { execute as scriptEditorModalWindowRegisterEventUseCase } from "./ScriptEditorModalWindowRegisterEventUseCase";
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
export const execute = (editor: AceAjax.Editor): void =>
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

                editor.resize(true);
            });
        });

        resizeObserver.observe(modalElement);
    }

    // 閉じるボタンのイベントを登録
    const hideIconElement: HTMLElement | null = document
        .getElementById($SCRIPT_EDITOR_HIDE_ICON_ID);

    if (hideIconElement) {
        hideIconElement.addEventListener(EventType.MOUSE_DOWN,
            scriptEditorModalHideIconMouseDownUseCase
        );
    }

    const barElement: HTMLElement | null = document
        .getElementById($SCRIPT_EDITOR_BAR_ID);

    if (barElement) {
        barElement.addEventListener(EventType.MOUSE_DOWN,
            scriptEditorModalWindowRegisterEventUseCase
        );
    }
};