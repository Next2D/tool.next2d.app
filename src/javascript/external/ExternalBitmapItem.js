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
        let canvas  = Util.$getCanvas();
        let context = null;
        if (this._$instance.type === InstanceType.SHAPE) {

            const bitmapObject = this._$instance._$recodes[this._$instance._$recodes.length - 4];
            canvas.width  = bitmapObject.width;
            canvas.height = bitmapObject.height;
            context = canvas.getContext("2d");

            const { BitmapData } = window.next2d.display;
            for (let idx = 0; this._$instance._$recodes.length > idx; ++idx) {

                const value = this._$instance._$recodes[idx];

                if (typeof value !== "object") {
                    continue;
                }

                if (value.namespace !== BitmapData.namespace) {
                    continue;
                }

                const bitmapCanvas  = Util.$getCanvas();
                bitmapCanvas.width  = value.width;
                bitmapCanvas.height = value.height;
                const bitmapContext = bitmapCanvas.getContext("2d");

                const bitmapData = context.createImageData(value.width, value.height);
                const buffer = value._$buffer;
                for (let idx = 0; idx < buffer.length; ++idx) {
                    bitmapData.data[idx] = buffer[idx];
                }

                bitmapContext.putImageData(bitmapData, 0, 0);
                context.drawImage(bitmapCanvas, 0, 0);
            }
        } else {

            canvas.width  = this._$instance.width;
            canvas.height = this._$instance.height;
            context = canvas.getContext("2d");

            const bitmapData = context.createImageData(canvas.width, canvas.height);
            const buffer = this._$instance._$buffer;
            for (let idx = 0; idx < buffer.length; ++idx) {
                bitmapData.data[idx] = buffer[idx];
            }

            context.putImageData(bitmapData, 0, 0);
        }

        const ext = path.split(".").pop().toLowerCase();
        window.FLfile.writeBase64(path, canvas.toDataURL(`image/${ext}`));

        Util.$poolCanvas(canvas);
    }
}