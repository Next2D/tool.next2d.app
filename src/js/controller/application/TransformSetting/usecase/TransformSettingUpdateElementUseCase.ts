import { execute as transformSettingUpdateXElementService } from "../service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "../service/TransformSettingUpdateYElementService";
import { execute as transformSettingUpdateWidthElementService } from "../service/TransformSettingUpdateWidthElementService";
import { execute as transformSettingUpdateHeightElementService } from "../service/TransformSettingUpdateHeightElementService";
import { execute as transformSettingUpdateScaleXElementService } from "../service/TransformSettingUpdateScaleXElementService";
import { execute as transformSettingUpdateScaleYElementService } from "../service/TransformSettingUpdateScaleYElementService";
import { execute as transformSettingUpdateRotationElementService } from "../service/TransformSettingUpdateRotationElementService";
import type { Character } from "@/core/domain/model/Character";

/**
 * @description 変形設定の値を更新
 *              Update the value of the transformation setting
 *
 * @param  {Character} character
 * @return {void}
 * @method
 * @public
 */
export const execute = (character: Character): void =>
{
    // 変形の値を更新
    transformSettingUpdateXElementService(character.x);
    transformSettingUpdateYElementService(character.y);
    transformSettingUpdateWidthElementService(character.width);
    transformSettingUpdateHeightElementService(character.height);
    transformSettingUpdateScaleXElementService(character.scaleX * 100);
    transformSettingUpdateScaleYElementService(character.scaleY * 100);
    transformSettingUpdateRotationElementService(character.rotation);
};