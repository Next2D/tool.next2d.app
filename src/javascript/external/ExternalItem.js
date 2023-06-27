/**
 * @class
 * @memberOf external
 */
class ExternalItem
{
    /**
     * @param {Instance} instance
     * @constructor
     */
    constructor (instance)
    {
        this._$instance = instance;
    }

    /**
     * @return {string}
     * @public
     */
    get name ()
    {
        return this._$instance.path;
    }

    /**
     * @return {string}
     * @public
     */
    get itemType ()
    {
        switch (this._$instance.type) {

            case InstanceType.SHAPE:
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