import { $CONTROLLER_LIBRARY_MENU_EXPORT_ID } from "@/config/ControllerConfig";

/**
 * @description 書き出しボタンをアクティブに更新
 *              Update export button active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_LIBRARY_MENU_EXPORT_ID);

    if (!element) {
        return ;
    }

    if (element.classList.contains("disabled")) {
        element.classList.remove("disabled");
    }
};