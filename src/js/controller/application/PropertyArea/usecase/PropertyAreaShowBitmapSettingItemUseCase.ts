import { execute as propertyAreaBlockShowService } from "../service/PropertyAreaBlockShowService";
import { execute as propertyAreaBlockHideService } from "../service/PropertyAreaBlockHideService";
import { $STAGE_SETTING_ID } from "@/config/StageSettingConfig";
import { $SOUND_SETTING_ID } from "@/config/SoundSettingConfig";
import { $OBJECT_SETTING_ID } from "@/config/ObjectSettingConfig";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { $PROPERTY_OBJECT_AREA_ID } from "@/config/PropertyConfig";
import { $EASE_SETTING_ID } from "@/config/EaseSettingConfig";
import { $VIDEO_SETTING_ID } from "@/config/VideoSettingConfig";
import { $TEXT_SETTING_ID } from "@/config/TextSettingConfig";
import { $NINE_SLICE_SETTING_ID } from "@/config/NineSliceSettingConfig";
import { $FILL_COLOR_SETTING_ID } from "@/config/FillColorSettingConfig";
import { $LOOP_SETTING_ID } from "@/config/LoopSettingConfig";
import { $INSTANCE_SETTING_ID } from "@/config/InstanceSettingConfig";
import { $TRANSFORM_SETTING_ID } from "@/config/TransformSettingConfig";
import { $COLOR_SETTING_ID } from "@/config/ColorSettingConfig";
import { $ALIGN_SETTING_ID } from "@/config/AlignSettingConfig";
import { $BLEND_SETTING_ID } from "@/config/BlendSettingConfig";
import { $FILTER_SETTING_ID } from "@/config/FilterSettingConfig";
import { $REFERENCE_SETTING_ID } from "@/config/ReferenceSettingConfig";

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
    const hideArray = [
        $STAGE_SETTING_ID,
        $SOUND_SETTING_ID,
        $EASE_SETTING_ID,
        $VIDEO_SETTING_ID,
        $TEXT_SETTING_ID,
        $NINE_SLICE_SETTING_ID,
        $FILL_COLOR_SETTING_ID,
        $LOOP_SETTING_ID
    ];

    const showArray = [
        $INSTANCE_SETTING_ID,
        $OBJECT_SETTING_ID,
        $PROPERTY_OBJECT_AREA_ID,
        $TRANSFORM_SETTING_ID,
        $COLOR_SETTING_ID,
        $ALIGN_SETTING_ID,
        $BLEND_SETTING_ID,
        $FILTER_SETTING_ID
    ];

    const tool = $getActiveTool();
    if (tool.name === $TOOL_ARROW_NAME) {
        hideArray.push($REFERENCE_SETTING_ID);
    } else {
        showArray.push($REFERENCE_SETTING_ID);
    }

    // 非表示項目を更新
    propertyAreaBlockHideService(hideArray);

    // 表示項目を更新
    propertyAreaBlockShowService(showArray);
};