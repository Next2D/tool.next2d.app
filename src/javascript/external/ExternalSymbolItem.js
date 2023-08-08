/**
 * @class
 * @memberOf external
 * @extends {ExternalItem}
 */
class ExternalSymbolItem extends ExternalItem
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
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get firstFrame ()
    {
        return this._$instance._$leftFrame - 1;
    }

    /**
     * @return {ExternalTimeline}
     * @readonly
     * @public
     */
    get timeline ()
    {
        return new ExternalTimeline(this._$instance, this._$document);
    }
}