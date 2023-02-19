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
     * @return {HTMLImageElement}
     * @method
     * @public
     */
    toImage (frame = 1)
    {
        if (!this._$instance) {
            return new Image();
        }

        const bounds = this._$instance.getBounds(
            [1, 0, 0, 1, 0, 0], null, null, frame
        );

        const width  = Math.abs(bounds.xMax - bounds.xMin);
        const height = Math.abs(bounds.yMax - bounds.yMin);

        const currentFrame = Util.$currentFrame;

        Util.$currentFrame = frame;

        const canvas = this._$instance.draw(
            Util.$getCanvas(),
            Math.ceil(width),
            Math.ceil(height),
            {
                "frame": frame,
                "matrix": [1, 0, 0, 1, 0, 0],
                "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                "blendMode": "normal",
                "filter": [],
                "loop": Util.$getDefaultLoopConfig()
            },
            null,
            frame
        );

        Util.$currentFrame = currentFrame;

        const image  = new Image();
        image.width  = Math.ceil(width);
        image.height = Math.ceil(height);
        image.src    = canvas.toDataURL();

        Util.$poolCanvas(canvas);

        return image;
    }

    /**
     * @param  {object} point
     * @param  {string} path
     * @return {boolean}
     * @method
     * @public
     */
    addItemToDocument (point, path)
    {
        if (!point || !path) {
            return false;
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

            Util.$dragElement = {
                "dataset": {
                    "libraryId": instance.id
                }
            };

            Util.$screen.drop({
                "offsetX": point.x + Util.$offsetLeft,
                "offsetY": point.y + Util.$offsetTop
            });

            Util.$dragElement = null;

            return true;
        }

        return false;
    }
}
