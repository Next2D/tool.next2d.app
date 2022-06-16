/**
 * @class
 * @extends {Instance}
 */
class Folder extends Instance
{
    /**
     * @param {object} object
     * @constructor
     */
    constructor (object)
    {
        super(object);

        this._$mode = "clone";
        if (object.mode) {
            this._$mode = object.mode;
        }
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "mode":     this.mode
        };
    }

    /**
     * @return {string}
     * @public
     */
    get mode ()
    {
        return this._$mode;
    }

    /**
     * @param  {string} mode
     * @return {void}
     * @public
     *
     */
    set mode (mode)
    {
        this._$mode = mode;
    }
}
