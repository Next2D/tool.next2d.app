import type { Character } from "@/core/domain/model/Character";
import { execute as propertyAreaShowBitmapSettingItemUseCase } from "./PropertyAreaShowBitmapSettingItemUseCase";
import { execute as objectSettingUpdateNameService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateNameService";
import { execute as objectSettingUpdateSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateSymbolService";
import { execute as objectSettingHideSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingHideSymbolService";
import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as transformSettingUpdateWidthElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateWidthElementService";
import { execute as transformSettingUpdateHeightElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateHeightElementService";

/**
 * @description Bitmap選択時のプロパティエリアの設定項目を表示
 *              Display the property area settings when Bitmap is selected
 *
 * @param  {Character} character
 * @return {void}
 * @method
 * @public
 */
export const execute = (character: Character): void =>
{
    // プロパティエリアの設定項目を更新
    propertyAreaShowBitmapSettingItemUseCase();

    // オブジェクト設定を更新
    objectSettingUpdateNameService(character.name);
    objectSettingUpdateSymbolService("");

    // シンボルのinputを非表示にする
    objectSettingHideSymbolService();

    // 変形の値を更新
    transformSettingUpdateXElementService(character.x);
    transformSettingUpdateYElementService(character.y);
    transformSettingUpdateWidthElementService(character.width);
    transformSettingUpdateHeightElementService(character.height);

    // カラーの値を更新

    // ブレンドの値を更新

    // フィルターの値を更新
};