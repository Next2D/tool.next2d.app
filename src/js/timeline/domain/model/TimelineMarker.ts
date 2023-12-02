/**
 * @description タイムラインのヘッダーの管理クラス
 *              Management class for timeline headers
 *
 * @class
 * @public
 */
export class TimelineMarker
{
    private _$clientWidth: number;
    private _$borderHeight: number;
    private _$offsetTop: number;

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
        this._$clientWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$borderHeight = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetTop = 0;
    }

    async initialize (): Promise<void>
    {
        //
    }

    /**
     * @description マーカーの幅
     *              Marker Width
     *
     * @member {number}
     * @public
     */
    get clientWidth (): number
    {
        return this._$clientWidth;
    }
    set clientWidth (client_width: number)
    {
        this._$clientWidth = client_width;
    }

    /**
     * @description マーカーのボーダーの高さ
     *              Marker border height
     *
     * @member {number}
     * @public
     */
    get borderHeight (): number
    {
        return this._$borderHeight;
    }
    set borderHeight (border_height: number)
    {
        this._$borderHeight = border_height;
    }

    /**
     * @description タイムラインのレイヤーコンテンツのoffsetTop
     *              OffsetTop of the timeline's layered content
     *
     * @member {number}
     * @public
     */
    get offsetTop (): number
    {
        return this._$offsetTop;
    }
    set offsetTop (offset_top: number)
    {
        this._$offsetTop = offset_top;
    }

    borderMove (): void
    {
        //
    }
}