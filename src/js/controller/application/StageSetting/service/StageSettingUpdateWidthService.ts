import { $STAGE_WIDTH_ID } from "@/config/StageSettingConfig";

/**
 * @description ステージの幅のInputの値を更新
 *              Update the value of the stage width Input
 *
 * @param  {number} width
 * @return {void}
 * @method
 * @public
 */
export const execute = (width: number): void =>
{
    const element: HTMLInputElement | null = document
        .getElementById($STAGE_WIDTH_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${width}`;
};