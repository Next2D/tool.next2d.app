import type { Character } from "@/core/domain/model/Character";
import { execute as propertyAreaShowBitmapSettingItemUseCase } from "./PropertyAreaShowBitmapSettingItemUseCase";
import { execute as objectSettingUpdateNameService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateNameService";
import { execute as objectSettingUpdateSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateSymbolService";
import { execute as objectSettingHideSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingHideSymbolService";
import { execute as transformSettingUpdateElementUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateElementUseCase";
import { execute as referenceSettingUpdateCellValueService } from "@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateCellValueService";

/**
 * @description MovieClip選択時のプロパティエリアの設定項目を表示
 *              Display the property area settings when MovieClip is selected
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
    transformSettingUpdateElementUseCase(
        character.x,
        character.y,
        character.width,
        character.height,
        character.scaleX,
        character.scaleY,
        character.rotation
    );

    // 中心点の値を更新
    referenceSettingUpdateCellValueService(character.referencePosition.pivot);

    // カラーの値を更新

    // ブレンドの値を更新

    // フィルターの値を更新
};