import { $TOOL_CIRCLE_NAME } from "../../../const/ToolConfig";
import { DrawTool } from "./DrawTool";

/**
 * @description 円の作成ツール
 *              Circle Creation Tools
 *
 * @class
 * @public
 * @extends {DrawTool}
 */
export class CircleTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_CIRCLE_NAME);
    }
}