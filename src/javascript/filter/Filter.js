/**
 * @class
 */
class Filter
{
    /**
     * @param {object} [object=null]
     * @constructor
     */
    constructor(object = null)
    {
        this._$blurX   = 4;
        this._$blurY   = 4;
        this._$quality = 1;
        this._$state   = true;
        this._$name    = "";

        if (object) {
            this.blurX   = object.blurX;
            this.blurY   = object.blurY;
            this.quality = object.quality | 0;
            this.state   = object.state;
        }
    }

    /**
     * @return {Filter}
     * @public
     */
    clone ()
    {
        return new this.constructor(this.toObject());
    }

    /**
     * @param  {Filter} filter
     * @return {boolean}
     * @public
     */
    isSame (filter)
    {
        if (this._$quality !== filter._$quality) {
            return false;
        }

        if (this._$blurX !== filter._$blurX) {
            return false;
        }

        if (this._$blurY !== filter._$blurY) {
            return false;
        }

        return true;
    }

    /**
     * @return {number}
     * @public
     */
    get blurX ()
    {
        return this._$blurX;
    }

    /**
     * @param  {number} blur_x
     * @return {void}
     * @public
     */
    set blurX (blur_x)
    {
        this._$blurX = Util.$clamp(+blur_x, Util.MIN_BLUR, Util.MAX_BLUR);
    }

    /**
     * @return {number}
     * @public
     */
    get blurY ()
    {
        return this._$blurY;
    }

    /**
     * @param  {number} blur_y
     * @return {void}
     * @public
     */
    set blurY (blur_y)
    {
        this._$blurY = Util.$clamp(+blur_y, Util.MIN_BLUR, Util.MAX_BLUR);
    }

    /**
     * @return {number}
     * @public
     */
    get quality ()
    {
        return this._$quality;
    }

    /**
     * @param  {number} quality
     * @return {void}
     * @public
     */
    set quality (quality)
    {
        this._$quality = Util.$clamp(quality | 0, 1, 3);
    }

    /**
     * @return {boolean}
     * @public
     */
    get state ()
    {
        return this._$state;
    }

    /**
     * @param  {boolean} state
     * @return {void}
     * @public
     */
    set state (state)
    {
        this._$state = state;
    }

    /**
     * @return {string}
     * @public
     */
    get name ()
    {
        return this._$name;
    }

    /**
     * @param  {string} name
     * @return {void}
     * @public
     */
    set name (name)
    {
        this._$name = name;
    }
}