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
     * @description 指定フレームに移動
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    move (frame)
    {
        this._$startFrame += frame;
        this._$endFrame   += frame;
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
