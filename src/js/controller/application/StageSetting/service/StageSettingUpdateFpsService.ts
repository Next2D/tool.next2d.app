import { $STAGE_FPS_ID } from "@/config/StageSettingConfig";

/**
 * @description ステージのフレームレートのInputの値を更新
 *              Update the value of the stage frame rate Input
 *
 * @param  {number} fps
 * @return {void}
 * @method
 * @public
 */
export const execute = (fps: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($STAGE_FPS_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${fps}`;
};