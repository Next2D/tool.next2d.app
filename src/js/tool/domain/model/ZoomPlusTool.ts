import { $TOOL_ZOOM_PLUS_NAME } from "../../../config/ToolConfig";
import { BaseTool } from "./BaseTool";

/**
 * @description ズームの拡大ツールの管理クラス
 *              Management class for zoom magnification tool
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ZoomPlusTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_ZOOM_PLUS_NAME);
    }
}