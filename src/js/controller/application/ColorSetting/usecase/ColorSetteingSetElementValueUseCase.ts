import { execute as colorSettingUpdateAlphaMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateAlphaMultiplierElementValueService";
import { execute as colorSettingUpdateAlphaOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateAlphaOffsetElementValueService";
import { execute as colorSettingUpdateRedMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateRedMultiplierElementValueService";
import { execute as colorSettingUpdateRedOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateRedOffsetElementValueService";
import { execute as colorSettingUpdateGreenMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateGreenMultiplierElementValueService";
import { execute as colorSettingUpdateGreenOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateGreenOffsetElementValueService";
import { execute as colorSettingUpdateBlueMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateBlueMultiplierElementValueService";
import { execute as colorSettingUpdateBlueOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateBlueOffsetElementValueService";

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

    // カラーマルチプライヤーの値を更新
    colorSettingUpdateRedMultiplierElementValueService(red_multiplier | 0);
    colorSettingUpdateRedOffsetElementValueService(red_offset | 0);
    colorSettingUpdateGreenMultiplierElementValueService(green_multiplier | 0);
    colorSettingUpdateGreenOffsetElementValueService(green_offset | 0);
    colorSettingUpdateBlueMultiplierElementValueService(blue_multiplier | 0);
    colorSettingUpdateBlueOffsetElementValueService(blue_offset | 0);
    colorSettingUpdateAlphaMultiplierElementValueService(alpha_multiplier | 0);
    colorSettingUpdateAlphaOffsetElementValueService(alpha_offset | 0);
};