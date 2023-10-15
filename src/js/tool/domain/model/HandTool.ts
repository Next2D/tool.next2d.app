import { BaseTool } from "./BaseTool";

/**
 * @description ハンドツールの管理クラス
 *              HandTools Management Class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class HandTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("hand");
    }
}