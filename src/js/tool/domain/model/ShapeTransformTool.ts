import { BaseTool } from "./BaseTool";

/**
 * @description Shapeのパス変形ツール
 *              Shape's Path Transformation Tool
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ShapeTransformTool extends BaseTool
{
    private _$element: null;
    private _$deletePointer: null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("shape-transform");

        /**
         * @type {HTMLDivElement}
         * @private
         */
        this._$element = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$deletePointer = null;
    }
}