/**
 * @class
 * @extends {Filter}
 */
class DropShadowFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     */
    constructor (object = null)
    {
        super(object);
        this.name = "DropShadowFilter";

        this._$distance   = 4;
        this._$angle      = 45;
        this._$color      = 0;
        this._$alpha      = 100;
        this._$strength   = 1;
        this._$inner      = false;
        this._$knockout   = false;
        this._$hideObject = false;

        if (object) {
            this.distance   = object.distance;
            this.angle      = object.angle;
            this.color      = object.color;
            this.alpha      = object.alpha * 100;
            this.strength   = object.strength;
            this.inner      = object.inner;
            this.knockout   = object.knockout;
            this.hideObject = object.hideObject;
        }
    }

    /**
     * @return {number}
     * @public
     */
    get distance ()
    {
        return this._$distance;
    }

    /**
     * @param  {number} distance
     * @return {void}
     * @public
     */
    set distance (distance)
    {
        this._$distance = Util.$clamp(
            +distance,
            FilterController.MIN_DISTANCE,
            FilterController.MAX_DISTANCE
        );
    }

    /**
     * @return {number}
     * @public
     */
    get angle ()
    {
        return this._$angle;
    }

    /**
     * @param  {number} angle
     * @return {void}
     * @public
     */
    set angle (angle)
    {
        this._$angle = +angle % 360;
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
     * @return {boolean}
     * @public
     */
    get hideObject ()
    {
        return this._$hideObject;
    }

    /**
     * @param  {boolean} hideObject
     * @return {void}
     * @public
     */
    set hideObject (hideObject)
    {
        this._$hideObject = !!hideObject;
    }

    /**
     * @param  {DropShadowFilter} filter
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

        if (this._$hideObject !== filter._$hideObject) {
            return false;
        }

        return super.isSame(filter);
    }

    /**
     * @return {window.next2d.filters.DropShadowFilter}
     * @public
     */
    createInstance ()
    {
        return new window.next2d.filters.DropShadowFilter(
            this.distance, this.angle, this.color, this.alpha / 100,
            this.blurX, this.blurY, this.strength, this.quality,
            this.inner, this.knockout, this.hideObject
        );
    }

    /**
     * @return {array}
     */
    toParamArray ()
    {
        return [null,
            this.distance, this.angle, this.color, this.alpha / 100,
            this.blurX, this.blurY, this.strength, this.quality,
            this.inner, this.knockout, this.hideObject
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
            "distance": this.distance,
            "angle": this.angle,
            "color": this.color,
            "alpha": this.alpha / 100,
            "strength": this.strength,
            "inner": this.inner,
            "knockout": this.knockout,
            "hideObject": this.hideObject
        };
    }
}
