import { $CONTROLLER_LIBRARY_CHANGE_SCENE_ID } from "@/config/ControllerConfig";

/**
 * @description MovieClip編集ボタンをアクティブに更新
 *              MovieClip edit button updated to active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_LIBRARY_CHANGE_SCENE_ID);

    if (!element) {
        return ;
    }

    if (element.classList.contains("disabled")) {
        element.classList.remove("disabled");
    }
};