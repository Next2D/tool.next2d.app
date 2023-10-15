import { $setActiveTool } from "../../application/Tool";
import { BaseTool } from "./BaseTool";

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
    private _$saved: boolean;
    private _$xReverse: boolean;
    private _$yReverse: boolean;
    private _$activeElement: string;
    private _$activeElements: Element[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("arrow");

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$activeElement = "";

        /**
         * @type {array}
         * @default {array}
         * @private
         */
        this._$activeElements = [];

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$xReverse = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$yReverse = false;
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
        // 各種イベントを登録
        this._$registerEvent();

        // 初期選択ツールとしてセット
        $setActiveTool(this);
    }

    /**
     * @description 初期起動時に各種イベントを登録
     *              Register various events at initial startup
     *
     * @return {void}
     * @method
     * @public
     */
    _$registerEvent (): void
    {
        // TODO
    }
}