/**
 * @class
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

        const workSpace = Util.$currentWorkSpace();

        let name = this._$instance.name;
        if (this._$instance._$folderId) {
            let parent = this._$instance;
            while (parent._$folderId) {
                parent = workSpace.getLibrary(parent._$folderId);
                name = `${parent.name}/${name}`;
            }
        }

        return name;
    }

    /**
     * @param  {string} path
     * @return {ExternalLibrary|null}
     */
    getItem (path)
    {
        path = `${path}`;

        const paths = path.split("/");
        const name  = paths.pop();

        const workSpace = Util.$currentWorkSpace();
        for (let instance of workSpace._$libraries.values()) {

            if (instance.name !== name) {
                continue;
            }

            if (paths.length) {

                if (!instance._$folderId) {
                    continue;
                }

                let match  = true;

                let length = paths.length - 1;
                let parent = instance;
                while (parent._$folderId) {

                    parent = workSpace.getLibrary(parent._$folderId);
                    if (parent.name !== paths[length--]) {
                        match = false;
                        break;
                    }

                }

                if (!match) {
                    continue;
                }
            }

            return new ExternalLibrary(instance);
        }

        return null;
    }

    /**
     * @param  {number} [width=0]
     * @param  {number} [height=0]
     * @param  {number} [frame=1]
     * @return {HTMLImageElement}
     * @method
     * @public
     */
    toImage (width = 0, height = 0, frame = 1)
    {
        if (!this._$instance) {
            return new Image(width, height);
        }

        const bounds = this._$instance.getBounds();
        if (!width) {
            width  = Math.abs(bounds.xMax - bounds.xMin);
        }
        if (!height) {
            height = Math.abs(bounds.yMax - bounds.yMin);
        }

        const currentFrame = Util.$currentFrame;

        Util.$currentFrame = frame;
        const image = this._$instance.toImage(
            Math.ceil(width),
            Math.ceil(height),
            {
                "frame": 1,
                "matrix": [1, 0, 0, 1, 0, 0],
                "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                "blendMode": "normal",
                "filter": [],
                "loop": Util.$getDefaultLoopConfig()
            }
        );

        Util.$currentFrame = currentFrame;

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

        const paths = path.split("/");
        const name  = paths.pop();

        const workSpace = Util.$currentWorkSpace();
        for (let instance of workSpace._$libraries.values()) {

            if (instance.name !== name) {
                continue;
            }

            if (paths.length) {

                if (!instance._$folderId) {
                    continue;
                }

                let match  = true;

                let length = paths.length - 1;
                let parent = instance;
                while (parent._$folderId) {

                    parent = workSpace.getLibrary(parent._$folderId);
                    if (parent.name !== paths[length--]) {
                        match = false;
                        break;
                    }

                }

                if (!match) {
                    continue;
                }
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
