import { execute as timelineLayerInitializeUseCase } from "../../application/TimelineLayer/usecase/TimelineLayerInitializeUseCase";

/**
 * @description タイムラインのレイヤーの管理クラス
 *              Management class for timeline layers
 *
 * @class
 * @public
 */
class TimelineLayer
{
    private readonly _$elements: HTMLElement[];
    private _$clientHeight: number;
    private _$targetLayers: Map<number, HTMLElement>;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {array}
         * @private
         */
        this._$elements = [];

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clientHeight = 0;

        /**
         * @type {Map}
         * @private
         */
        this._$targetLayers = new Map();
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
        timelineLayerInitializeUseCase();
    }

    /**
     * @description レイヤーコンテンツのElement配列
     *              Element array of layered content
     *
     * @readonly
     * @return {array}
     * @public
     */
    get elements (): HTMLElement[]
    {
        return this._$elements;
    }

    /**
     * @description レイヤーエリアの表示の高さを返却する
     *              Return the display height of the layer area
     *
     * @member {number}
     * @public
     */
    get clientHeight (): number
    {
        return this._$clientHeight;
    }
    set clientHeight (height: number)
    {
        this._$clientHeight = height;
    }

    /**
     * @description 選択したレイヤーを格納したマップデータを返却
     *              Returns map data containing selected layers
     *
     * @member {Map}
     * @public
     */
    get targetLayers (): Map<number, HTMLElement>
    {
        return this._$targetLayers;
    }
}

export const timelineLayer = new TimelineLayer();