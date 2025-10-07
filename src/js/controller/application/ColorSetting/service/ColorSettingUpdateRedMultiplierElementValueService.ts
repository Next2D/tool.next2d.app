import { $COLOR_RED_MULTIPLIER_ID } from "@/config/ColorSettingConfig";

/**
 * @description RedMultiplierのinput要素に値を設定する
 *              Set value to the RedMultiplier input element
 *
 * @param  {number} red 0~100の範囲で指定
 * @return {void}
 * @method
 * @public
 */
export const execute = (red: number): void =>
{
    const element = document
        .getElementById($COLOR_RED_MULTIPLIER_ID) as HTMLInputElement | null;
    if (!element) {
        return ;
    }

    element.value = `${red | 0}`;
};