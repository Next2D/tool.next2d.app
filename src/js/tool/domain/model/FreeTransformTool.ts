import { $TOOL_FREE_TRANSFORM_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";

/**
 * @description 自由変形ツールの管理クラス
 *              Free Transformation Tool Management Class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class FreeTransformTool extends BaseTool
{
    private _$validity: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_FREE_TRANSFORM_NAME);

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$validity = false;
    }

    /**
     * @member {boolean}
     * @readonly
     * @public
     */
    get validity (): boolean
    {
        return this._$validity;
    }
}