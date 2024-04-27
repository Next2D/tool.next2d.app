import { $STAGE_HEIGHT_ID } from "@/config/StageSettingConfig";

/**
 * @description ステージの高さのInputの値を更新
 *              Update the value of the stage height Input
 *
 * @param  {number} height
 * @return {void}
 * @method
 * @public
 */
export const execute = (height: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($STAGE_HEIGHT_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${height}`;
};