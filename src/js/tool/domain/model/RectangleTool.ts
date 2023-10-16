import { $TOOL_RECTANGLE_NAME } from "../../../config/ToolConfig";
import { DrawTool } from "./DrawTool";

/**
 * @description 矩形作成ツール
 *              Rectangle Creation Tool
 *
 * @class
 * @public
 * @extends {DrawTool}
 */
export class RectangleTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_RECTANGLE_NAME);
    }
}