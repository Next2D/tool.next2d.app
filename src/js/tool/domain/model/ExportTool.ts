import { $TOOL_EXPORT_NAME } from "../../../const/ToolConfig";
import { BaseTool } from "./BaseTool";

/**
 * @description 書き出しツールの管理クラス
 *              Management class for export tools
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ExportTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_EXPORT_NAME);
    }
}