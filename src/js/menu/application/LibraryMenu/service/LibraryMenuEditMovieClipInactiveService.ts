import { $CONTROLLER_LIBRARY_CHANGE_SCENE_ID } from "@/config/ControllerConfig";

/**
 * @description MovieClip編集ボタンを非アクティブに更新
 *              MovieClip edit button updated to inactive
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

    if (!element.classList.contains("disabled")) {
        element.classList.add("disabled");
    }
};