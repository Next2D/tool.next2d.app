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
    constructor (work_space)
    {
        /**
         * @type {WorkSpace}
         * @private
         */
        this._$workSpace = work_space;

        /**
         * @type {ExternalTimeline}
         * @private
         */
        this._$timeline = new ExternalTimeline(this);

        /**
         * @type {ExternalLibrary}
         * @private
         */
        this._$library = new ExternalLibrary(this);
    }

    /**
     * @return {string}
     * @public
     */
    get pathURI ()
    {
        return this._$workSpace.name;
    }

    /**
     * @return {ExternalTimeline[]}
     * @public
     */
    get timelines ()
    {
        const timelines = [];
        for (const instance of this._$workSpace._$libraries.values()) {

            if (instance.type !== InstanceType.MOVIE_CLIP) {
                continue;
            }

            timelines.push(new ExternalTimeline(this._$workSpace));
        }
        return timelines;
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
