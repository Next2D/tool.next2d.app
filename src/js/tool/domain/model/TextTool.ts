import { $TOOL_TEXT_NAME } from "../../../const/ToolConfig";
import { BaseTool } from "./BaseTool";

/**
 * @description テキストツールの管理クラス
 *              TextTools Management Class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class TextTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_TEXT_NAME);
    }
}