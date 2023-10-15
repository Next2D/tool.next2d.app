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
        super("text");
    }
}