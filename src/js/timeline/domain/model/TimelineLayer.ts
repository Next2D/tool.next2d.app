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
    private _$targetLayers: Map<number, number[]>;

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
     * @description 選択したレイヤーIdとフレーム番号を格納したマップデータを返却
     *              Returns map data containing the selected layer Id and frame number
     *
     * @member {Map}
     * @public
     */
    get targetLayers (): Map<number, number[]>
    {
        return this._$targetLayers;
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
     * @description 選択中のレイヤー・フレーム情報を初期化
     *              Initializes the currently selected layer/frame information
     *
     * @return {void}
     * @method
     * @public
     */
    clearSelectedTarget (): void
    {
        this._$targetLayers.clear();
    }
}

export const timelineLayer = new TimelineLayer();