/**
 * @class
 * @memberOf external
 * @extends {ExternalItem}
 */
class ExternalSoundItem extends ExternalItem
{
    /**
     * @param {Instance} instance
     * @param {ExternalDocument} external_document
     * @constructor
     * @public
     */
    constructor (instance, external_document)
    {
        super(instance, external_document);

        /**
         * @type {string}
         * @default "repeat"
         * @private
         */
        this._$loopMode = "repeat";

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$loopCount = 1;
    }

    /**
     * @member {string}
     * @public
     */
    get soundLoopMode ()
    {
        return this._$loopMode;
    }
    set soundLoopMode (loop_mode)
    {
        this._$loopMode = loop_mode;
    }

    /**
     * @member {number}
     * @public
     */
    get soundLoop ()
    {
        return this._$loopCount;
    }
    set soundLoop (loop_count)
    {
        this._$loopCount = loop_count;
    }
}