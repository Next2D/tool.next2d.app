import { $COLOR_ALPHA_OFFSET_ID } from "@/config/ColorSettingConfig";

/**
 * @description AlphaOffsetのinput要素に値を設定する
 *              Set value to the AlphaOffset input element
 *
 * @param  {number} alpha -255 ~ 255の範囲で指定
 * @return {void}
 * @method
 * @public
 */
export const execute = (alpha: number): void =>
{
    const element = document
        .getElementById($COLOR_ALPHA_OFFSET_ID) as HTMLInputElement | null;
    if (!element) {
        return ;
    }

    element.value = `${alpha | 0}`;
};