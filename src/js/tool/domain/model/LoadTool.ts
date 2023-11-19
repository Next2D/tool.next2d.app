import { $TOOL_LOAD_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";

/**
 * @description n2dファイルの読み込みツール
 *              Tools for loading n2d files
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class LoadTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_LOAD_NAME);
    }
}