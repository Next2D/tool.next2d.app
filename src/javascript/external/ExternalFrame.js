/**
 * @class
 * @memberOf external
 */
class ExternalFrame
{
    /**
     * @param {number} frame
     * @param {ExternalLayer} parent
     * @constructor
     * @public
     */
    constructor (frame, parent)
    {
        this._$frame  = frame;
        this._$parent = parent;
    }

    /**
     * @return {array}
     * @public
     */
    get elements ()
    {
        const characters = this
            ._$parent
            ._$layer
            .getActiveCharacter(this._$frame);

        const elements = [];
        for (let idx = 0; idx < characters.length; ++idx) {
            elements.push(new ExternalElement(characters[idx], this._$parent));
        }

        return elements;
    }
}
