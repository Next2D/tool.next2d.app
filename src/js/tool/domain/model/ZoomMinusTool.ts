import { BaseTool } from "./BaseTool";

/**
 * @description ズームの縮小ツールの管理クラス
 *              Zoom reduction tool management class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ZoomMinusTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("zoom-minus");
    }
}