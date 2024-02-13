import { $CONTROLLER_LIBRARY_PHOTOPEA_ID } from "@/config/ControllerConfig";

/**
 * @description Photopea起動ボタンを非アクティブに更新
 *              Update to deactivate Photopea start button
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

    if (!element.classList.contains("disabled")) {
        element.classList.add("disabled");
    }
};