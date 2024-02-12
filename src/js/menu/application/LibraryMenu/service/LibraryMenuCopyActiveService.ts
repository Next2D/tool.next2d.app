import { $CONTROLLER_LIBRARY_MENU_COPY_ID } from "@/config/ControllerConfig";

/**
 * @description コピーボタンをアクティブに更新
 *              Update copy button to active
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

    if (element.classList.contains("disabled")) {
        element.classList.remove("disabled");
    }
};