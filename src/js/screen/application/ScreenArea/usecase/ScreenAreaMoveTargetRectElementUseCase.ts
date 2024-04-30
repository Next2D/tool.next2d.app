import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { execute as screenAreaShowTargetRectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaShowTargetRectElementService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";

/**
 * @description 選択範囲のElementを選択中のDisplayObjectの座標を基準に表示
 *              Display the selected range Element based on the coordinates of the selected DisplayObject
 *
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    const bounds = screenAreaCalcSelectedBoundsService(movie_clip);

    const tool = $getActiveTool();

    // 表示範囲の更新
    screenAreaShowTargetRectElementService(
        bounds.xMin,
        bounds.yMin,
        Math.ceil(Math.abs(bounds.xMax - bounds.xMin)),
        Math.ceil(Math.abs(bounds.yMax - bounds.yMin)),
        tool.name === $TOOL_ARROW_NAME ? "arrow" : "free_transform"
    );
};