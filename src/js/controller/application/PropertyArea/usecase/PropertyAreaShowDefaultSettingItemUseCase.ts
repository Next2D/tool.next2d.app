import { execute as propertyAreaBlockShowService } from "../service/PropertyAreaBlockShowService";
import { execute as propertyAreaBlockHideService } from "../service/PropertyAreaBlockHideService";
import { $SOUND_SETTING_ID } from "@/config/SoundSettingConfig";
import { $STAGE_SETTING_ID } from "@/config/StageSettingConfig";
import { $OBJECT_SETTING_ID } from "@/config/ObjectSettingConfig";

/**
 * @description プロパティエリアの表示項目を変更
 *              Change display items in property area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    propertyAreaBlockHideService([
        "object-area",
        "ruler-setting",
        "instance-setting",
        "fill-color-setting"
    ]);

    // 表示項目を更新
    propertyAreaBlockShowService([
        $STAGE_SETTING_ID,
        $SOUND_SETTING_ID,
        $OBJECT_SETTING_ID,
        "color-setting",
        "blend-setting",
        "filter-setting"
    ]);
};