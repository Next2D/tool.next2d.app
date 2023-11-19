import { $TOOL_ROUND_RECT_NAME } from "@/config/ToolConfig";
import { DrawTool } from "./DrawTool";

/**
 * @description 角丸矩形作成ツール
 *              Rounded Rectangle Creation Tool
 *
 * @class
 * @public
 * @extends {DrawTool}
 */
export class RoundRectTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_ROUND_RECT_NAME);
    }
}