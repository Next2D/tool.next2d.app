import { $STAGE_BG_COLOR_ID } from "@/config/StageSettingConfig";

/**
 * @description ステージの背景色のInputの値を更新
 *              Update the value of the stage background color Input
 *
 * @param  {string} color
 * @return {void}
 * @method
 * @public
 */
export const execute = (color: string): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($STAGE_BG_COLOR_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = color;
};