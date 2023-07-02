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
        const canvas  = Util.$getCanvas();
        canvas.width  = this._$instance.width;
        canvas.height = this._$instance.height;
        const context = canvas.getContext("2d");

        const bitmapData = context.createImageData(canvas.width, canvas.height);
        const buffer = this._$instance._$buffer;
        for (let idx = 0; idx < buffer.length; ++idx) {
            bitmapData.data[idx] = buffer[idx];
        }

        context.putImageData(bitmapData, 0, 0);

        const ext = path.split(".").pop().toLowerCase();
        window.FLfile.writeBase64(path, canvas.toDataURL(`image/${ext}`));

        Util.$poolCanvas(canvas);
    }
}