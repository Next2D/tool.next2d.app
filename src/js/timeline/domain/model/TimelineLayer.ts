import type { Layer } from "@/core/domain/model/Layer";
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
    private readonly _$elements: HTMLElement[];
    private readonly _$targetLayers: Map<Layer, number[]>;

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
         * @private
         */
        this._$numberOfDisplays = 0;

        /**
         * @type {array}
         * @private
         */
        this._$elements = [];

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
     * @description 現在のタイムラインに表示されてるレイヤー数
     *              Number of layers displayed in the current timeline
     *
     * @memner {number}
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
     * @description 選択したレイヤーIdとフレーム番号を格納したマップデータを返却
     *              Returns map data containing the selected layer Id and frame number
     *
     * @member {Map}
     * @public
     */
    get targetLayers (): Map<Layer, number[]>
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
}

export const timelineLayer = new TimelineLayer();