import { $TOOL_BUCKET_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";

/**
 * @description バケツツールの管理クラス
 *              Bucket tool management class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class BucketTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_BUCKET_NAME);
    }
}