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
        super("bucket");
    }
}