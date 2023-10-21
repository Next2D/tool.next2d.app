import {
    $getSelectElement,
    $setSelectElement
} from "../ShortcutSettingMenuUtil";

/**
 * @description 選択したElementにclassをセットしてアクティブ情報を入れ替える
 *              Set class to the selected Element to replace the active information.
 *
 * @params {HTMLElement | null} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement | null): void =>
{
    const currentSelectedElement: HTMLElement | null = $getSelectElement();
    if (currentSelectedElement) {
        currentSelectedElement.classList.remove("shortcut-active");
    }

    if (element) {
        element.classList.add("shortcut-active");
    }

    $setSelectElement(element);
};