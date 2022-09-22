/**
 * Next2Dのフィルターと連動したBevelFilterクラス
 * BevelFilter class in conjunction with Next2D filters
 *
 * @class
 * @extends {Filter}
 * @memberOf filter
 */
class BevelFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        super(object);
        this.name = "BevelFilter";

        this._$distance       = 4;
        this._$angle          = 45;
        this._$highlightColor = 0xffffff;
        this._$highlightAlpha = 100;
        this._$shadowColor    = 0;
        this._$shadowAlpha    = 100;
        this._$strength       = 1;
        this._$type           = "inner";
        this._$knockout       = false;

        if (object) {
            this.distance       = object.distance;
            this.angle          = object.angle;
            this.highlightColor = object.highlightColor | 0;
            this.highlightAlpha = object.highlightAlpha * 100;
            this.shadowColor    = object.shadowColor | 0;
            this.shadowAlpha    = object.shadowAlpha * 100;
            this.strength       = object.strength;
            this.type           = object.type;
            this.knockout       = object.knockout;
        }
    }

    /**
     * @description シャドウのオフセット距離です。
     *              The offset distance for the shadow, in pixels.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get distance ()
    {
        return this._$distance;
    }
    set distance (distance)
    {
        this._$distance = Util.$clamp(
            +distance,
            FilterController.MIN_DISTANCE,
            FilterController.MAX_DISTANCE
        );
    }

    /**
     * @description シャドウの角度
     *              The angle of the shadow.
     *
     * @member  {number}
     * @default 45
     * @public
     */
    get angle ()
    {
        return this._$angle;
    }
    set angle (angle)
    {
        this._$angle = +angle % 360;
    }

    /**
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 0xffffff
     * @public
     */
    get highlightColor ()
    {
        return this._$highlightColor;
    }
    set highlightColor (highlight_color)
    {
        this._$highlightColor = Util.$clamp(highlight_color | 0, 0, 0xffffff);
    }

    /**
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get highlightAlpha ()
    {
        return this._$highlightAlpha;
    }
    set highlightAlpha (highlight_alpha)
    {
        this._$highlightAlpha = Util.$clamp(+highlight_alpha, 0, 100);
    }

    /**
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get shadowColor ()
    {
        return this._$shadowColor;
    }
    set shadowColor (shadow_color)
    {
        this._$shadowColor = Util.$clamp(shadow_color | 0, 0, 0xffffff);
    }

    /**
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get shadowAlpha ()
    {
        return this._$shadowAlpha;
    }
    set shadowAlpha (shadow_alpha)
    {
        this._$shadowAlpha = Util.$clamp(+shadow_alpha, 0, 100);
    }

    /**
     * @description インプリントの強さまたは広がりです。
     *              The strength of the imprint or spread.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get strength ()
    {
        return this._$strength;
    }
    set strength (strength)
    {
        this._$strength = Util.$clamp(
            +strength,
            FilterController.MIN_STRENGTH,
            FilterController.MAX_STRENGTH
        );
    }

    /**
     * @description オブジェクトでのベベルの配置
     *              The placement of the bevel on the object.
     *
     * @member  {string}
     * @default BitmapFilterType.INNER
     * @public
     */
    get type ()
    {
        return this._$type;
    }
    set type (type)
    {
        type = `${type}`.toLowerCase();
        switch (type) {

            case "outer":
            case "inner":
                this._$type = type;
                break;

            default:
                this._$type = "full";
                break;

        }
    }

    /**
     * @description オブジェクトにノックアウト効果を適用するかどうか
     *              Specifies whether the object has a knockout effect.
     *
     * @member  {boolean}
     * @default false
     * @public
     */
    get knockout ()
    {
        return this._$knockout;
    }
    set knockout (knockout)
    {
        this._$knockout = !!knockout;
    }

    /**
     * @description 指定されたフィルターと同一の設定がないか判定
     *              Determine if there are any settings identical to the specified filter
     *
     * @param  {BevelFilter} filter
     * @return {boolean}
     * @method
     * @public
     */
    isSame (filter)
    {
        if (this._$distance !== filter._$distance) {
            return false;
        }

        if (this._$angle !== filter._$angle) {
            return false;
        }

        if (this._$highlightColor !== filter._$highlightColor) {
            return false;
        }

        if (this._$highlightAlpha !== filter._$highlightAlpha) {
            return false;
        }

        if (this._$shadowColor !== filter._$shadowColor) {
            return false;
        }

        if (this._$shadowAlpha !== filter._$shadowAlpha) {
            return false;
        }

        if (this._$strength !== filter._$strength) {
            return false;
        }

        if (this._$type !== filter._$type) {
            return false;
        }

        if (this._$knockout !== filter._$knockout) {
            return false;
        }

        return super.isSame(filter);
    }

    /**
     * @description Next2DのBevelFilterを生成
     *              Generate Next2D BevelFilter
     *
     * @return {window.next2d.filters.BevelFilter}
     * @method
     * @public
     */
    createInstance ()
    {
        return new window.next2d.filters.BevelFilter(
            this.distance, this.angle, this.highlightColor, this.highlightAlpha / 100,
            this.shadowColor, this.shadowAlpha / 100, this.blurX, this.blurY,
            this.strength, this.quality, this.type, this.knockout
        );
    }

    /**
     * @description クラス内の変数を配列にして返す
     *              Returns an array of variables in the class
     *
     * @return {array}
     * @method
     * @public
     */
    toParamArray ()
    {
        return [null,
            this.distance, this.angle, this.highlightColor, this.highlightAlpha / 100,
            this.shadowColor, this.shadowAlpha / 100, this.blurX, this.blurY,
            this.strength, this.quality, this.type, this.knockout
        ];
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject ()
    {
        return {
            "name": this.name,
            "blurX": this.blurX,
            "blurY": this.blurY,
            "quality": this.quality,
            "state": this.state,
            "distance": this.distance,
            "angle": this.angle,
            "highlightColor": this.highlightColor,
            "highlightAlpha": this.highlightAlpha / 100,
            "shadowColor": this.shadowColor,
            "shadowAlpha": this.shadowAlpha / 100,
            "strength": this.strength,
            "type": this.type,
            "knockout": this.knockout
        };
    }
}
