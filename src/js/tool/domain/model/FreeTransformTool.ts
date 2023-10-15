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
        super("free-transform");

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
        // TODO
    }
}