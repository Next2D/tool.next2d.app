import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $setSelectedMode } from "../PropertyAreaUtil";
import { $SOUND_SETTING_ID } from "@/config/SoundSettingConfig";
import { $STAGE_SETTING_ID } from "@/config/StageSettingConfig";
import { $OBJECT_SETTING_ID } from "@/config/ObjectSettingConfig";
import { $PROPERTY_OBJECT_AREA_ID } from "@/config/PropertyConfig";
import { execute as objectSettingShowSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingShowSymbolService";
import { execute as objectSettingUpdateNameService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateNameService";
import { execute as objectSettingUpdateSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateSymbolService";
import { execute as propertyAreaBlockShowService } from "../service/PropertyAreaBlockShowService";
import { execute as propertyAreaBlockHideService } from "../service/PropertyAreaBlockHideService";
import { $INSTANCE_SETTING_ID } from "@/config/InstanceSettingConfig";

/**
 * @description プロパティエリアの表示項目を変更
 *              Change display items in property area
 *
 * @param  {MovieClip} movie_clip
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (movie_clip: MovieClip): Promise<void> =>
{
    // 非表示項目を更新
    propertyAreaBlockHideService([
        $INSTANCE_SETTING_ID,
        $PROPERTY_OBJECT_AREA_ID
    ]);

    // 表示項目を更新
    propertyAreaBlockShowService([
        $STAGE_SETTING_ID,
        $OBJECT_SETTING_ID,
        $SOUND_SETTING_ID
    ]);

    // シンボルエリアを表示
    objectSettingShowSymbolService();

    // 表示名を更新
    objectSettingUpdateNameService(movie_clip.name);

    // シンボル名を更新
    objectSettingUpdateSymbolService(movie_clip.symbol);

    // 選択モードをクリア
    $setSelectedMode("");
};