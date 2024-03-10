import type { FrameObjectImpl } from "@/interface/FrameObjectImpl";
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
    private readonly _$selectedFrameObject: FrameObjectImpl;
    private readonly _$selectedLayers: Layer[];
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
         * @private
         */
        this._$selectedFrameObject = {
            "start": 0,
            "end": 0
        };

        /**
         * @type {array}
         * @private
         */
        this._$selectedLayers = [];
    }

    /**
     * @description 選択情報を初期化
     *              Initialize selection information
     *
     * @return {void}
     * @method
     * @public
     */
    clear (): void
    {
        this._$selectedFrameObject.start = 0;
        this._$selectedFrameObject.end   = 0;
        this._$selectedLayers.length = 0;
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
     * @description タイムラインのフレームエリアで最初に選択したフレーム
     *              Number of layers displayed in the current timeline
     *
     * @memner {number}
     * @public
     */
    get selectedFrameObject (): FrameObjectImpl
    {
        return this._$selectedFrameObject;
    }

    /**
     * @description タイムラインのマウスダウンで選択したレイヤーの配列
     *              Array of layers selected with mouse down on timeline
     *
     * @memner {number}
     * @public
     */
    get selectedLayers (): Layer[]
    {
        return this._$selectedLayers;
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