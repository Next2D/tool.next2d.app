import { $COLOR_ALPHA_MULTIPLIER_ID } from "@/config/ColorSettingConfig";

/**
 * @description AlphaMultiplierのinput要素に値を設定する
 *              Set value to the AlphaMultiplier input element
 *
 * @param  {number} alpha 0~100の範囲で指定
 * @return {void}
 * @method
 * @public
 */
export const execute = (alpha: number): void =>
{
    const element = document
        .getElementById($COLOR_ALPHA_MULTIPLIER_ID) as HTMLInputElement | null;
    if (!element) {
        return ;
    }

    element.value = `${alpha | 0}`;
};