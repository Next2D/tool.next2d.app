import type { ToolImpl } from "@/interface/ToolImpl";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { $setCursor } from "@/global/GlobalUtil";
import { execute as screenStageAreaAllDisplayObjectInactiveService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaAllDisplayObjectInactiveService";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_PLUS_NAME } from "@/config/ToolConfig";

/**
 * @description ズームプラスツールのマウスムーブイベントサービス
 *              Zoom plus tool mouse move event service
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 全てのDisplayObjectのイベント無効化する
    screenStageAreaAllDisplayObjectInactiveService();

    const tool: ToolImpl<ZoomPlusTool> = $getDefaultTool($TOOL_ZOOM_PLUS_NAME);
    if (!tool) {
        return ;
    }

    // カーソルを変更
    $setCursor(tool.cursor);
};