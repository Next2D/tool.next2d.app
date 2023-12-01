import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 指定IDのElementをアクティブ表示に変更する
 *              Changes the Element with the specified ID to the active display
 *
 * @params {HTMLElement} text_element
 * @params {HTMLElement} tab_element
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number): void =>
{
    const element: HTMLElement | null = document
        .getElementById(`layer-name-${layer_id}`);

    if (!element) {
        return ;
    }

    element.contentEditable   = "true";
    element.style.borderBottom = "1px solid #f5f5f5";
    $updateKeyLock(true);
};