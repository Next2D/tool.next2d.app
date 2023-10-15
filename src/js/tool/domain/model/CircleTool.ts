import { DrawTool } from "./DrawTool";

/**
 * @description 円の作成ツール
 *              Circle Creation Tools
 *
 * @class
 * @public
 * @extends {DrawTool}
 */
export class CircleTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("circle");
    }
}