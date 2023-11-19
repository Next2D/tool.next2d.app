import { $TOOL_SAVE_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";

/**
 * @description n2dファイルの書き出しツール
 *              Export tool for n2d files
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class SaveTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_SAVE_NAME);
    }
}