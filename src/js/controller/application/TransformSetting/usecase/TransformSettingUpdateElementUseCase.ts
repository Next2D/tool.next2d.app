import { execute as transformSettingUpdateXElementService } from "../service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "../service/TransformSettingUpdateYElementService";
import { execute as transformSettingUpdateWidthElementService } from "../service/TransformSettingUpdateWidthElementService";
import { execute as transformSettingUpdateHeightElementService } from "../service/TransformSettingUpdateHeightElementService";
import { execute as transformSettingUpdateScaleXElementService } from "../service/TransformSettingUpdateScaleXElementService";
import { execute as transformSettingUpdateScaleYElementService } from "../service/TransformSettingUpdateScaleYElementService";
import { execute as transformSettingUpdateRotationElementService } from "../service/TransformSettingUpdateRotationElementService";

/**
 * @description 変形設定の値を更新
 *              Update the value of the transformation setting
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @param  {number} scale_x
 * @param  {number} scale_y
 * @param  {number} rotation
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    x: number,
    y: number,
    width: number,
    height: number,
    scale_x: number,
    scale_y: number,
    rotation: number
): void => {
    transformSettingUpdateXElementService(x);
    transformSettingUpdateYElementService(y);
    transformSettingUpdateWidthElementService(width);
    transformSettingUpdateHeightElementService(height);
    transformSettingUpdateScaleXElementService(scale_x * 100);
    transformSettingUpdateScaleYElementService(scale_y * 100);
    transformSettingUpdateRotationElementService(rotation);
};