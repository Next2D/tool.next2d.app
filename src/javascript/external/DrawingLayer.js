/**
 * @class
 * @memberOf external
 */
class DrawingLayer
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$begin = false;
    }

    /**
     * @method
     * @public
     */
    beginDraw ()
    {
        this._$begin = true;
    }
}
