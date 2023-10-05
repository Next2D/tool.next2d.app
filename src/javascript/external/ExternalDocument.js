/**
 * @class
 * @memberOf external
 */
class ExternalDocument
{
    /**
     * @param {WorkSpace} work_space
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

            timelines.push(new ExternalTimeline(instance, this));
        }
        return timelines;
    }

    /**
     * @param  {string} path
     * @return {void}
     * @method
     * @public
     */
    swapElement (path)
    {
        const workSpace = Util.$currentWorkSpace();
        if (!workSpace._$nameMap.has(path)) {
            return ;
        }

        Util
            .$tools
            .getDefaultTool("arrow")
            .changeCharacter({
                "target": {
                    "value": workSpace._$nameMap.get(path)
                }
            });
    }

    /**
     * @return {ExternalTimeline}
     * @method
     * @public
     */
    getTimeline ()
    {
        return new ExternalTimeline(this._$workSpace.scene, this);
    }

    /**
     * @return {Promise}
     * @method
     * @public
     */
    exitEditMode ()
    {
        return Util
            .$tools
            .getDefaultTool("arrow")
            .moveScene();
    }

    /**
     * @return {ExternalLibrary}
     */
    get library ()
    {
        return new ExternalLibrary(this);
    }
}
