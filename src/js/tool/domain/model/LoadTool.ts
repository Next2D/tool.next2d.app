import { BaseTool } from "./BaseTool";

/**
 * @description n2dファイルの書き出すツール
 *              Tools for exporting n2d files
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
        super("load");
    }
}