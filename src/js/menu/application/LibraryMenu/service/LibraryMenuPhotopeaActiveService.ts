import { $CONTROLLER_LIBRARY_PHOTOPEA_ID } from "@/config/ControllerConfig";

/**
 * @description Photopea起動ボタンをアクティブに更新
 *              Update Photopea activation button to active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_LIBRARY_PHOTOPEA_ID);

    if (!element) {
        return ;
    }

    if (element.classList.contains("disabled")) {
        element.classList.remove("disabled");
    }
};