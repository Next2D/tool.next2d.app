/**
 * @class
 * @extends {Filter}
 */
class BevelFilter extends Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
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
    get highlightColor ()
    {
        return this._$highlightColor;
    }

    /**
     * @param  {number} highlight_color
     * @return {void}
     * @public
     */
    set highlightColor (highlight_color)
    {
        this._$highlightColor = Util.$clamp(highlight_color | 0, 0, 0xffffff);
    }

    /**
     * @return {number}
     * @public
     */
    get highlightAlpha ()
    {
        return this._$highlightAlpha;
    }

    /**
     * @param  {number} highlight_alpha
     * @return {void}
     * @public
     */
    set highlightAlpha (highlight_alpha)
    {
        this._$highlightAlpha = Util.$clamp(+highlight_alpha, 0, 100);
    }

    /**
     * @return {number}
     * @public
     */
    get shadowColor ()
    {
        return this._$shadowColor;
    }

    /**
     * @param  {number} shadow_color
     * @return {void}
     * @public
     */
    set shadowColor (shadow_color)
    {
        this._$shadowColor = Util.$clamp(shadow_color | 0, 0, 0xffffff);
    }

    /**
     * @return {number}
     * @public
     */
    get shadowAlpha ()
    {
        return this._$shadowAlpha;
    }

    /**
     * @param  {number} shadow_alpha
     * @return {void}
     * @public
     */
    set shadowAlpha (shadow_alpha)
    {
        this._$shadowAlpha = Util.$clamp(+shadow_alpha, 0, 100);
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
     * @return {string}
     * @public
     */
    get type ()
    {
        return this._$type;
    }

    /**
     * @param  {string} type
     * @return {void}
     * @public
     */
    set type (type)
    {
        this._$type = type;
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
        this._$knockout = knockout;
    }

    /**
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
     * @return {window.next2d.filters.BevelFilter}
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
     * @return {array}
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
