import { $SCRIPT_EDITOR_TITLE_ID } from "@/config/ScriptEditorModalConfig";

/**
 * @description スクリプトエディタのタイトル情報を更新
 *              Updated title information in Script Editor
 *
 * @param  {string} name
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (name: string, frame: number): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCRIPT_EDITOR_TITLE_ID);

    if (!element) {
        return ;
    }

    element.textContent = `${name} / frame [${frame}]`;
};