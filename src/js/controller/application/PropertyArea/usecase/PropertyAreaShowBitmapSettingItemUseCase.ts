import { execute as propertyAreaBlockShowService } from "../service/PropertyAreaBlockShowService";
import { execute as propertyAreaBlockHideService } from "../service/PropertyAreaBlockHideService";
import { $STAGE_SETTING_ID } from "@/config/StageSettingConfig";
import { $SOUND_SETTING_ID } from "@/config/SoundSettingConfig";
import { $OBJECT_SETTING_ID } from "@/config/ObjectSettingConfig";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";

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
    const tool = $getActiveTool();

    const hideArray = [
        $STAGE_SETTING_ID,
        $SOUND_SETTING_ID,
        "ease-setting",
        "video-setting",
        "text-setting",
        "nine-slice-setting",
        "fill-color-setting",
        "loop-setting"
    ];

    const showArray = [
        "instance-setting",
        $OBJECT_SETTING_ID,
        "object-area",
        "transform-setting",
        "color-setting",
        "align-setting",
        "blend-setting",
        "filter-setting"
    ];

    if (tool.name === $TOOL_ARROW_NAME) {
        hideArray.push("reference-setting");
    } else {
        showArray.push("reference-setting");
    }

    // 非表示項目を更新
    propertyAreaBlockHideService(hideArray);

    // 表示項目を更新
    propertyAreaBlockShowService(showArray);
};