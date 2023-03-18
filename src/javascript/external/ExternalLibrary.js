/**
 * @class
 * @memberOf external
 */
class ExternalLibrary
{
    /**
     * @param {Instance} [instance=null]
     */
    constructor (instance = null)
    {
        this._$instance = instance;
    }

    /**
     * @return {string}
     * @public
     */
    get name ()
    {
        if (!this._$instance) {
            return "";
        }

        return this._$instance.path;
    }

    /**
     * @param  {string} path
     * @return {ExternalLibrary|null}
     */
    getItem (path)
    {
        path = `${path}`;

        const workSpace = Util.$currentWorkSpace();
        for (let instance of workSpace._$libraries.values()) {

            if (instance.path !== path) {
                continue;
            }

            return new ExternalLibrary(instance);
        }

        return null;
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

        const currentFrame = Util.$currentFrame;

        Util.$currentFrame = frame;

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
                null, frame
            )
            .then((canvas) =>
            {
                Util.$currentFrame = currentFrame;

                const image  = new Image();
                image.width  = width;
                image.height = height;
                image.src    = canvas.toDataURL();

                Util.$poolCanvas(canvas);

                return image;
            });
    }

    /**
     * @param  {object} point
     * @param  {string} path
     * @return {Promise}
     * @method
     * @public
     */
    addItemToDocument (point, path)
    {
        if (!point || !path) {
            return Promise.resolve(false);
        }

        path = `${path}`;

        const workSpace = Util.$currentWorkSpace();
        for (let instance of workSpace._$libraries.values()) {

            if (instance.path !== path) {
                continue;
            }

            // ライブラリを選択状態に
            Util
                .$libraryController
                .activeInstance = document.getElementById(
                    `library-child-id-${instance.id}`
                );

            return Util
                .$screen
                .drop({
                    "offsetX": point.x + Util.$offsetLeft,
                    "offsetY": point.y + Util.$offsetTop
                })
                .then(() =>
                {
                    return Promise.resolve(true);
                });
        }

        return Promise.resolve(false);
    }
}
