import { BaseTool } from "./BaseTool";

/**
 * @description ズームの拡大ツールの管理クラス
 *              Management class for zoom magnification tool
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ZoomTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("zoom");
    }
}