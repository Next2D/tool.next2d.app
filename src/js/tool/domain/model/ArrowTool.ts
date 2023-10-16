import { $TOOL_ARROW_NAME } from "../../../config/ToolConfig";
import { BaseTool } from "./BaseTool";
import { execute as arrowToolInitializeUseCase } from "../../application/usecase/ArrowToolInitializeUseCase";

/**
 * @description アローツールの管理クラス
 *              ArrowTools Management Class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ArrowTool extends BaseTool
{
    // private _$saved: boolean;
    // private _$xReverse: boolean;
    // private _$yReverse: boolean;
    // private _$activeElement: string;
    // private _$activeElements: Element[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_ARROW_NAME);

        // /**
        //  * @type {boolean}
        //  * @default false
        //  * @private
        //  */
        // this._$saved = false;

        // /**
        //  * @type {string}
        //  * @default ""
        //  * @private
        //  */
        // this._$activeElement = "";

        // /**
        //  * @type {array}
        //  * @default {array}
        //  * @private
        //  */
        // this._$activeElements = [];

        // /**
        //  * @type {boolean}
        //  * @default false
        //  * @private
        //  */
        // this._$xReverse = false;

        // /**
        //  * @type {boolean}
        //  * @default false
        //  * @private
        //  */
        // this._$yReverse = false;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Promise}
     * @method
     * @public
     */
    async initialize (): Promise<void>
    {
        arrowToolInitializeUseCase(this);
    }
}