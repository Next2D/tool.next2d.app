import { $CONTROLLER_LIBRARY_MENU_COPY_ID } from "@/config/ControllerConfig";

/**
 * @description コピーボタンを非アクティブに更新
 *              Update copy button to inactive
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_LIBRARY_MENU_COPY_ID);

    if (!element) {
        return ;
    }

    if (!element.classList.contains("disabled")) {
        element.classList.add("disabled");
    }
};