import { $getActiveTool } from "@/tool/application/ToolUtil";
import { execute as targetRectShowElementService } from "@/screen/application/TargetRect/service/TargetRectShowElementService";
import { execute as targetRectHideElementService } from "@/screen/application/TargetRect/service/TargetRectHideElementService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 選択範囲のElementを選択中のDisplayObjectの座標を基準に表示
 *              Display the selected range Element based on the coordinates of the selected DisplayObject
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const bounds = screenAreaCalcSelectedBoundsService(movieClip);
    if (!bounds) {
        // 表示範囲のelementを非表示
        targetRectHideElementService();
        return ;
    }

    const tool = $getActiveTool();

    // 表示範囲の更新
    targetRectShowElementService(
        bounds.xMin,
        bounds.yMin,
        Math.ceil(Math.abs(bounds.xMax - bounds.xMin) * workSpace.scale),
        Math.ceil(Math.abs(bounds.yMax - bounds.yMin) * workSpace.scale),
        tool.name === $TOOL_ARROW_NAME ? "arrow" : "free_transform"
    );
};