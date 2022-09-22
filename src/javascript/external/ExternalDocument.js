/**
 * @class
 * @memberOf external
 */
class ExternalDocument
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        /**
         * @type {ExternalTimeline}
         * @private
         */
        this._$timeline = new ExternalTimeline();

        /**
         * @type {ExternalLibrary}
         * @private
         */
        this._$library = new ExternalLibrary();
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
