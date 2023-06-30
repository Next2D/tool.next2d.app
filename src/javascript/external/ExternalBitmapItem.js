/**
 * @class
 * @memberOf external
 * @extends {ExternalItem}
 */
class ExternalBitmapItem extends ExternalItem
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
         * @type {boolean}
         * @private
         */
        this._$smoothing = false;
    }

    /**
     * @member {boolean}
     * @public
     */
    get allowSmoothing ()
    {
        return this._$smoothing;
    }
    set allowSmoothing (smoothing)
    {
        this._$smoothing = !!smoothing;
    }

    /**
     * @param  {string} path
     * @return {void}
     * @method
     * @public
     */
    exportToFile (path)
    {
        // const ext = path.split(".").pop().toLowerCase();
        window.FLfile.writeBuffer(path, this._$instance._$buffer);
    }
}