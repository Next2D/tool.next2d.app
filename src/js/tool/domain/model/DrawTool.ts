import { BaseTool } from "./BaseTool";

/**
 * @description 描画を実行するツールの親クラス
 *              Parent class of the tool that performs the drawing
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class DrawTool extends BaseTool
{
    /**
     * @param {string} name
     * @constructor
     * @public
     */
    constructor (name: string)
    {
        super(name);
    }
}