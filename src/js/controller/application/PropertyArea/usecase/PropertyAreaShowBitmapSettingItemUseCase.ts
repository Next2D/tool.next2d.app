import { execute as propertyAreaBlockShowService } from "../service/PropertyAreaBlockShowService";
import { execute as propertyAreaBlockHideService } from "../service/PropertyAreaBlockHideService";
import { $STAGE_SETTING_ID } from "@/config/StageSettingConfig";
import { $SOUND_SETTING_ID } from "@/config/SoundSettingConfig";
import { $OBJECT_SETTING_ID } from "@/config/ObjectSettingConfig";

/**
 * @description Bitmap選択時のプロパティエリアの設定項目を表示
 *              Display the property area settings when Bitmap is selected
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 非表示項目を更新
    propertyAreaBlockHideService([
        $STAGE_SETTING_ID,
        $SOUND_SETTING_ID,
        "ease-setting",
        "video-setting",
        "text-setting",
        "nine-slice-setting",
        "fill-color-setting",
        "loop-setting"
    ]);

    // 表示項目を更新
    propertyAreaBlockShowService([
        "instance-setting",
        $OBJECT_SETTING_ID,
        "object-area",
        "transform-setting",
        "color-setting",
        "align-setting",
        "reference-setting",
        "blend-setting",
        "filter-setting"
    ]);
};