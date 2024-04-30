import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import type { FreeTransformTool } from "@/tool/domain/model/FreeTransformTool";
import type { ToolImpl } from "@/interface/ToolImpl";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { $calcBoundingBox } from "@/core/application/CoreUtil";
import { execute as screenAreaShowTargetRectElementService } from "@/screen/application/ScreenArea/service/ScreenAreaShowTargetRectElementService";
import { execute as controllerAreaShowSingleSettingUseCase } from "@/controller/application/ControllerArea/usecase/ControllerAreaShowSingleSettingUseCase";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import {
    $TOOL_ARROW_NAME,
    $TOOL_FREE_TRANSFORM_NAME
} from "@/config/ToolConfig";

/**
 * @description DisplayObjectを選択状態に更新
 *              Update the DisplayObject to the selected state
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} layer_index
 * @param  {array} depths
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer_index: number,
    depths: number[]
): void => {

    const tool: ToolImpl<ArrowTool | FreeTransformTool> = $getActiveTool();

    switch (tool.name) {

        case $TOOL_ARROW_NAME:
        case $TOOL_FREE_TRANSFORM_NAME:
            break;

        default:
            return ;

    }

    const layer = movie_clip.getLayer(layer_index);
    if (!layer) {
        return;
    }

    // 選択範囲のdepthを追加
    movie_clip.selectedDepths.set(layer_index, depths);

    // 表示がアクティブなら表示を更新
    if (work_space.active && movie_clip.active) {

        const bounds = screenAreaCalcSelectedBoundsService(movie_clip);

        // 表示範囲の更新
        screenAreaShowTargetRectElementService(
            bounds.xMin,
            bounds.yMin,
            Math.ceil(Math.abs(bounds.xMax - bounds.xMin)),
            Math.ceil(Math.abs(bounds.yMax - bounds.yMin)),
            tool.name === $TOOL_ARROW_NAME ? "arrow" : "free_transform"
        );

        // コントローラー表示を更新
        if (depths.length === 1) {
            const character = layer.getCharacter(movie_clip.currentFrame, depths[0]);
            if (!character) {
                return ;
            }
            // 単一選択時のコントローラー表示を更新
            controllerAreaShowSingleSettingUseCase(character.libraryId);
        } else {
            // TODO
        }
    }
};