import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";
import { execute as arrowToolInitializeUseCase } from "../../application/ArrowTool/usecase/ArrowToolInitializeUseCase";

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
    // private _$xReverse: boolean;
    // private _$yReverse: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_ARROW_NAME);

        // カーソルをセット
        this.setCursor("auto");

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
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        arrowToolInitializeUseCase(this);
    }
}