import { BaseTool } from "./BaseTool";

/**
 * @description ペンツールの管理クラス
 *              PenTools Management Class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class PenTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("pen");
    }
}