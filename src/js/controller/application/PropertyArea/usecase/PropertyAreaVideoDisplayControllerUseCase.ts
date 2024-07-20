import type { Character } from "@/core/domain/model/Character";
import { execute as propertyAreaShowBitmapSettingItemUseCase } from "./PropertyAreaShowBitmapSettingItemUseCase";
import { execute as objectSettingUpdateNameService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateNameService";
import { execute as objectSettingUpdateSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateSymbolService";
import { execute as objectSettingHideSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingHideSymbolService";
import { execute as transformSettingUpdateElementUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateElementUseCase";

/**
 * @description Video選択時のプロパティエリアの設定項目を表示
 *              Display the property area settings when Video is selected
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
    transformSettingUpdateElementUseCase(character);

    // カラーの値を更新

    // ブレンドの値を更新

    // フィルターの値を更新
};