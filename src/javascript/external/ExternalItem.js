/**
 * @class
 * @memberOf external
 */
class ExternalItem
{
    /**
     * @param {Instance} instance
     * @param {ExternalDocument} external_document
     * @constructor
     * @public
     */
    constructor (instance, external_document)
    {
        /**
         * @type {Instance}
         * @private
         */
        this._$instance = instance;

        /**
         * @type {ExternalDocument}
         * @private
         */
        this._$document = external_document;
    }

    /**
     * @return {string}
     * @public
     */
    get name ()
    {
        return this._$instance.getPath(this._$document._$workSpace);
    }

    /**
     * @return {string}
     * @public
     */
    get itemType ()
    {
        switch (this._$instance.type) {

            case InstanceType.SHAPE:
                if (this._$instance._$inBitmap) {
                    return "bitmap";
                }
                return "graphic";

            case InstanceType.MOVIE_CLIP:
                return "movie clip";

            default:
                return this._$instance.type;

        }
    }

    /**
     * @param  {number} [frame=1]
     * @return {Promise}
     * @method
     * @public
     */
    toImage (frame = 1)
    {
        if (!this._$instance) {
            return Promise.resolve(new Image());
        }

        const bounds = this._$instance.getBounds(
            [1, 0, 0, 1, 0, 0], frame
        );

        const width  = Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
        const height = Math.ceil(Math.abs(bounds.yMax - bounds.yMin));

        return this
            ._$instance
            .draw(Util.$getCanvas(),
                width,
                height,
                {
                    "frame": frame,
                    "matrix": [1, 0, 0, 1, 0, 0],
                    "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                    "blendMode": "normal",
                    "filter": [],
                    "loop": Util.$getDefaultLoopConfig()
                },
                frame
            )
            .then((canvas) =>
            {
                const image  = new Image();
                image.width  = width;
                image.height = height;
                image.src    = canvas.toDataURL();

                Util.$poolCanvas(canvas);

                return image;
            });
    }
}