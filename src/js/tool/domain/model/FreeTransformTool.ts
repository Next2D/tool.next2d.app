import { $TOOL_FREE_TRANSFORM_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";

/**
 * @description 自由変形ツールの管理クラス
 *              Free Transformation Tool Management Class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class FreeTransformTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_FREE_TRANSFORM_NAME);
    }
}