import { $getActiveTool } from "@/tool/application/ToolUtil";
import { execute as targetRectShowElementService } from "@/screen/application/TargetRect/service/TargetRectShowElementService";
import { execute as targetRectHideElementService } from "@/screen/application/TargetRect/service/TargetRectHideElementService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { $getCurrentWorkSpace, $getMatrixBounds } from "@/core/application/CoreUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

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
    // if (movieClip.isSingleSelectedOfDisplayObject()) {
    //     targetRectHideElementService();
    //     return ;
    // }

    const calcBounds = screenAreaCalcSelectedBoundsService(movieClip);
    if (!calcBounds) {
        // 表示範囲のelementを非表示
        targetRectHideElementService();
        return ;
    }

    const bounds = $getMatrixBounds(
        calcBounds.xMin,
        calcBounds.yMin,
        calcBounds.xMax,
        calcBounds.yMax,
        $getConcatenatedMatrix()
    );

    const tool = $getActiveTool();

    // 表示範囲の更新
    targetRectShowElementService(
        Math.ceil(bounds.xMin),
        Math.ceil(bounds.yMin),
        Math.ceil(Math.abs(bounds.xMax - bounds.xMin)),
        Math.ceil(Math.abs(bounds.yMax - bounds.yMin)),
        tool.name === $TOOL_ARROW_NAME ? "arrow" : "free_transform"
    );
};