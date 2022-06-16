/**
 * @class
 */
class ExternalDocument
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        this._$timeline = new ExternalTimeline();
        this._$library  = new ExternalLibrary();
    }

    /**
     * @return {ExternalTimeline}
     * @method
     * @public
     */
    getTimeline ()
    {
        return this._$timeline;
    }

    /**
     * @return {ExternalLibrary}
     */
    get library ()
    {
        return this._$library;
    }
}
