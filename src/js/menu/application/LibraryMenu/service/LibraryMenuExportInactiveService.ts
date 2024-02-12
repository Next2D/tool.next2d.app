import { $CONTROLLER_LIBRARY_MENU_EXPORT_ID } from "@/config/ControllerConfig";

/**
 * @description 書き出しボタンを非アクティブに更新
 *              Update export button inactive
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

    if (!element.classList.contains("disabled")) {
        element.classList.add("disabled");
    }
};