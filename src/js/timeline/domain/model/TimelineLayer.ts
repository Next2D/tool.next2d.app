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
    private _$clientHeight: number;
    private _$numberOfDisplays: number;
    private _$viewCount: number;
    private _$distIndex: number;
    private readonly _$elements: HTMLElement[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clientHeight = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$numberOfDisplays = 0;

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
        this._$viewCount = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$distIndex = -1;
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
     * @return {array}
     * @readonly
     * @public
     */
    get elements (): HTMLElement[]
    {
        return this._$elements;
    }

    /**
     * @description 現在のタイムラインに表示されてるレイヤー数
     *              Number of layers displayed in the current timeline
     *
     * @member {number}
     * @public
     */
    get numberOfDisplays (): number
    {
        return this._$numberOfDisplays;
    }
    set numberOfDisplays (count: number)
    {
        this._$numberOfDisplays = count;
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
     * @description 指定のElementからレイヤーElementを返却
     *              Returns a Layer Element from the specified Element
     *
     * @param  {HTMLElement} element
     * @return {HTMLElement | void}
     * @method
     * @public
     */
    getLayerElementFromElement (element: HTMLElement): HTMLElement | undefined
    {
        return this._$elements[parseInt(element.dataset.layerIndex as string)];
    }

    /**
     * @description 現在のビューカウント
     *              Current view count
     *
     * @member {number}
     * @public
     */
    get viewCount (): number
    {
        return this._$viewCount;
    }
    set viewCount (view_count: number)
    {
        this._$viewCount = view_count;
    }

    /**
     * @description 移動先のレイヤーの表インデックス値
     *              Table index value of the layer to move to
     *
     * @member {number}
     * @public
     */
    get distIndex (): number
    {
        return this._$distIndex;
    }
    set distIndex (index: number)
    {
        this._$distIndex = index;
    }
}

export const timelineLayer = new TimelineLayer();