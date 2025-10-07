import { $COLOR_BLUE_MULTIPLIER_ID } from "@/config/ColorSettingConfig";

/**
 * @description BlueMultiplierのinput要素に値を設定する
 *              Set value to the BlueMultiplier input element
 *
 * @param  {number} blue 0~100の範囲で指定
 * @return {void}
 * @method
 * @public
 */
export const execute = (blue: number): void =>
{
    const element = document
        .getElementById($COLOR_BLUE_MULTIPLIER_ID) as HTMLInputElement | null;
    if (!element) {
        return ;
    }

    element.value = `${blue | 0}`;
};