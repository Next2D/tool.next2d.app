/**
 * @class
 */
class EmptyCharacter
{
    /**
     * @param {object} object
     *
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        if (object) {
            this._$startFrame = object.startFrame;
            this._$endFrame   = object.endFrame;
        } else {
            this._$startFrame = 1;
            this._$endFrame   = 2;
        }
    }

    /**
     * @description 空フレーム判定
     *
     * @return {boolean}
     * @public
     */
    isEmpty ()
    {
        return true;
    }

    /**
     * @return {number}
     * @public
     */
    get startFrame ()
    {
        return this._$startFrame;
    }

    /**
     * @param  {number} start_frame
     * @return {void}
     * @public
     */
    set startFrame (start_frame)
    {
        this._$startFrame = start_frame | 0;
    }

    /**
     * @return {number}
     * @public
     */
    get endFrame ()
    {
        return this._$endFrame;
    }

    /**
     * @param  {number} end_frame
     * @return {void}
     * @public
     */
    set endFrame (end_frame)
    {
        this._$endFrame = end_frame | 0;
    }

    /**
     * @return {object}
     * @method
     * @public
     */
    toObject ()
    {
        return {
            "startFrame": this.startFrame,
            "endFrame": this.endFrame
        };
    }
}
