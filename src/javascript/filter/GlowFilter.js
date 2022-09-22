/**
 * Next2Dのフィルターと連動したGlowFilterクラス
 * GlowFilter class in conjunction with Next2D filters
 *
 * @class
 * @extends {Filter}
 * @memberOf filter
 */
class GlowFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        super(object);
        this.name = "GlowFilter";

        this._$color      = 0;
        this._$alpha      = 100;
        this._$strength   = 1;
        this._$inner      = false;
        this._$knockout   = false;

        if (object) {
            this.color      = object.color;
            this.alpha      = object.alpha * 100;
            this.strength   = object.strength;
            this.inner      = object.inner;
            this.knockout   = object.knockout;
        }
    }

    /**
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get color ()
    {
        return this._$color;
    }
    set color (color)
    {
        this._$color = Util.$clamp(color | 0, 0, 0xffffff);
    }

    /**
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get alpha ()
    {
        return this._$alpha;
    }
    set alpha (alpha)
    {
        this._$alpha = Util.$clamp(+alpha, 0, 100);
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
     * @description グローが内側グローであるかどうか
     *              Specifies whether the glow is an inner glow.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    get inner ()
    {
        return this._$inner;
    }
    set inner (inner)
    {
        this._$inner = !!inner;
    }

    /**
     * @description オブジェクトにノックアウト効果を適用するかどうか
     *              Specifies whether the object has a knockout effect.
     *
     * @member  {boolean}
     * @default true
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
     * @param  {GlowFilter} filter
     * @return {boolean}
     * @method
     * @public
     */
    isSame (filter)
    {
        if (this._$color !== filter._$color) {
            return false;
        }

        if (this._$alpha !== filter._$alpha) {
            return false;
        }

        if (this._$strength !== filter._$strength) {
            return false;
        }

        if (this._$inner !== filter._$inner) {
            return false;
        }

        if (this._$knockout !== filter._$knockout) {
            return false;
        }

        return super.isSame(filter);
    }

    /**
     * @description Next2DのGlowFilterを生成
     *              Generate Next2D GlowFilter
     *
     * @return {window.next2d.filters.GlowFilter}
     * @method
     * @public
     */
    createInstance ()
    {
        return new window.next2d.filters.GlowFilter(
            this.color, this.alpha / 100, this.blurX, this.blurY,
            this.strength, this.quality, this.inner, this.knockout
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
            this.color, this.alpha / 100, this.blurX, this.blurY,
            this.strength, this.quality, this.inner, this.knockout
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
            "color": this.color,
            "alpha": this.alpha / 100,
            "strength": this.strength,
            "inner": this.inner,
            "knockout": this.knockout
        };
    }
}
