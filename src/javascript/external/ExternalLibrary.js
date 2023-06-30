/**
 * @class
 * @memberOf external
 */
class ExternalLibrary
{
    /**
     * @param {ExternalDocument} external_document
     * @constructor
     * @public
     */
    constructor (external_document)
    {
        /**
         * @type {ExternalDocument}
         * @private
         */
        this._$document = external_document;
    }

    /**
     * @param  {string} path
     * @return {ExternalItem[]|null}
     */
    getItem (path)
    {
        path = `${path}`;

        const workSpace = this._$document._$workSpace;
        for (let instance of workSpace._$libraries.values()) {

            if (instance.path !== path) {
                continue;
            }

            switch (instance.type) {

                case InstanceType.MOVIE_CLIP:
                    return new ExternalSymbolItem(
                        instance, this._$document
                    );

                case InstanceType.SOUND:
                    return new ExternalSoundItem(
                        instance, this._$document
                    );

                case InstanceType.BITMAP:
                    return new ExternalBitmapItem(
                        instance, this._$document
                    );

                case InstanceType.SHAPE:
                    if (instance.inBitmap) {
                        const bitmapObject = instance._$recodes[instance._$recodes.length - 4];

                        const bitmapInstance = workSpace.getLibrary(
                            bitmapObject._$instanceId
                        );

                        return new ExternalBitmapItem(
                            bitmapInstance, this._$document
                        );
                    }
                    return new ExternalItem(
                        instance, this._$document
                    );

                default:
                    return new ExternalItem(
                        instance, this._$document
                    );

            }

        }

        return null;
    }

    /**
     * @return {array}
     * @public
     */
    get items ()
    {
        const workSpace = this._$document._$workSpace;

        const items = [];
        for (const instance of workSpace._$libraries.values()) {
            switch (instance.type) {

                case InstanceType.MOVIE_CLIP:
                    items.push(new ExternalSymbolItem(instance, this._$document));
                    break;

                case InstanceType.SHAPE:
                    if (instance.inBitmap) {
                        items.push(new ExternalBitmapItem(instance, this._$document));
                    } else {
                        items.push(new ExternalItem(instance, this._$document));
                    }
                    break;

                case InstanceType.BITMAP:
                    items.push(new ExternalBitmapItem(instance, this._$document));
                    break;

                case InstanceType.SOUND:
                    items.push(new ExternalSoundItem(instance, this._$document));
                    break;

                default:
                    items.push(new ExternalItem(instance, this._$document));
                    break;

            }
        }

        // 最初はrootなので除外
        items.shift();

        return items;
    }

    /**
     * @param  {string} path
     * @return {number}
     * @method
     * @public
     */
    findItemIndex (path)
    {
        const workSpace = this._$document._$workSpace;

        let index = 0;
        for (const instance of workSpace._$libraries.values()) {

            index++;

            if (instance.path !== path) {
                continue;
            }

            break;
        }

        return index - 1;
    }

    /**
     * @param  {string} path
     * @return {boolean}
     * @method
     * @public
     */
    itemExists (path)
    {
        path = `${path}`;

        const workSpace = this._$document._$workSpace;
        for (let instance of workSpace._$libraries.values()) {

            if (instance.path !== path) {
                continue;
            }

            return true;
        }

        return false;
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

        const workSpace = this._$document._$workSpace;
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
