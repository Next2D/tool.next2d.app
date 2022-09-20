/**
 * @class
 * @extends {Filter}
 */
class GlowFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
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
     * @return {number}
     * @public
     */
    get color ()
    {
        return this._$color;
    }

    /**
     * @param  {number} color
     * @return {void}
     * @public
     */
    set color (color)
    {
        this._$color = Util.$clamp(color | 0, 0, 0xffffff);
    }

    /**
     * @return {number}
     * @public
     */
    get alpha ()
    {
        return this._$alpha;
    }

    /**
     * @param  {number} alpha
     * @return {void}
     * @public
     */
    set alpha (alpha)
    {
        this._$alpha = Util.$clamp(+alpha, 0, 100);
    }

    /**
     * @return {number}
     * @public
     */
    get strength ()
    {
        return this._$strength;
    }

    /**
     * @param  {number} strength
     * @return {void}
     * @public
     */
    set strength (strength)
    {
        this._$strength = Util.$clamp(
            +strength,
            FilterController.MIN_STRENGTH,
            FilterController.MAX_STRENGTH
        );
    }

    /**
     * @return {boolean}
     * @public
     */
    get inner ()
    {
        return this._$inner;
    }

    /**
     * @param  {boolean} inner
     * @return {void}
     * @public
     */
    set inner (inner)
    {
        this._$inner = !!inner;
    }

    /**
     * @return {boolean}
     * @public
     */
    get knockout ()
    {
        return this._$knockout;
    }

    /**
     * @param  {boolean} knockout
     * @return {void}
     * @public
     */
    set knockout (knockout)
    {
        this._$knockout = !!knockout;
    }

    /**
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
     * @return {window.next2d.filters.GlowFilter}
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
     * @return {array}
     */
    toParamArray ()
    {
        return [null,
            this.color, this.alpha / 100, this.blurX, this.blurY,
            this.strength, this.quality, this.inner, this.knockout
        ];
    }

    /**
     * @return {object}
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
