import { execute as propertyAreaBlockShowService } from "../service/PropertyAreaBlockShowService";
import { execute as propertyAreaBlockHideService } from "../service/PropertyAreaBlockHideService";
import { $STAGE_SETTING_ID } from "@/config/StageSettingConfig";
import { $SOUND_SETTING_ID } from "@/config/SoundSettingConfig";
import { $OBJECT_SETTING_ID } from "@/config/ObjectSettingConfig";
import { $setSelectedMode } from "../PropertyAreaUtil";
import { $PROPERTY_OBJECT_AREA_ID } from "@/config/PropertyConfig";
import { $INSTANCE_SETTING_ID } from "@/config/InstanceSettingConfig";
import { $EASE_SETTING_ID } from "@/config/EaseSettingConfig";
import { $VIDEO_SETTING_ID } from "@/config/VideoSettingConfig";
import { $TEXT_SETTING_ID } from "@/config/TextSettingConfig";
import { $NINE_SLICE_SETTING_ID } from "@/config/NineSliceSettingConfig";
import { $FILL_COLOR_SETTING_ID } from "@/config/FillColorSettingConfig";
import { $LOOP_SETTING_ID } from "@/config/LoopSettingConfig";
import { $TRANSFORM_SETTING_ID } from "@/config/TransformSettingConfig";
import { $COLOR_SETTING_ID } from "@/config/ColorSettingConfig";
import { $ALIGN_SETTING_ID } from "@/config/AlignSettingConfig";
import { $REFERENCE_SETTING_ID } from "@/config/ReferenceSettingConfig";
import { $BLEND_SETTING_ID } from "@/config/BlendSettingConfig";
import { $FILTER_SETTING_ID } from "@/config/FilterSettingConfig";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { $TOOL_FREE_TRANSFORM_NAME } from "@/config/ToolConfig";

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
    // 非表示項目を更新
    propertyAreaBlockHideService([
        $INSTANCE_SETTING_ID,
        $SOUND_SETTING_ID,
        $STAGE_SETTING_ID,
        $OBJECT_SETTING_ID,
        $EASE_SETTING_ID,
        $VIDEO_SETTING_ID,
        $TEXT_SETTING_ID,
        $NINE_SLICE_SETTING_ID,
        $FILL_COLOR_SETTING_ID,
        $LOOP_SETTING_ID
    ]);

    const showArray = [
        $PROPERTY_OBJECT_AREA_ID,
        $TRANSFORM_SETTING_ID,
        $COLOR_SETTING_ID,
        $ALIGN_SETTING_ID,
        $BLEND_SETTING_ID,
        $FILTER_SETTING_ID
    ];

    const tool = $getActiveTool();
    if (tool.name === $TOOL_FREE_TRANSFORM_NAME) {
        showArray.push($REFERENCE_SETTING_ID);
    }

    // 表示項目を更新
    propertyAreaBlockShowService(showArray);

    // 選択モードをクリア
    $setSelectedMode("multi");
};