import { execute as colorSettingUpdateAlphaMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateAlphaMultiplierElementValueService";

/**
 * @description カラーマルチプライヤー・オフセット値を設定する
 *              Set color multipliers and offsets
 *
 * @param  {number} red_multiplier
 * @param  {number} green_multiplier
 * @param  {number} blue_multiplier
 * @param  {number} alpha_multiplier
 * @param  {number} red_offset
 * @param  {number} green_offset
 * @param  {number} blue_offset
 * @param  {number} alpha_offset
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    red_multiplier: number,
    green_multiplier: number,
    blue_multiplier: number,
    alpha_multiplier: number,
    red_offset: number,
    green_offset: number,
    blue_offset: number,
    alpha_offset: number
): void => {
    colorSettingUpdateAlphaMultiplierElementValueService(alpha_multiplier | 0);
};