import { $COLOR_GREEN_OFFSET_ID } from "@/config/ColorSettingConfig";

/**
 * @description Green Offsetのinput要素に値を設定する
 *              Set value to the Green Offset input element
 *
 * @param  {number} green 0~100の範囲で指定
 * @return {void}
 * @method
 * @public
 */
export const execute = (green: number): void =>
{
    const element = document
        .getElementById($COLOR_GREEN_OFFSET_ID) as HTMLInputElement | null;
    if (!element) {
        return ;
    }

    element.value = `${green | 0}`;
};