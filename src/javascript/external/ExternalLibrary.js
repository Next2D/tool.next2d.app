/**
 * @class
 * @memberOf external
 */
class ExternalLibrary
{
    /**
     * @param {ExternalDocument} external_document
     */
    constructor (external_document)
    {
        /**
         * @type {ExternalDocument}
         * @default null
         * @private
         */
        this._$document = external_document;
    }

    /**
     * @member {ExternalDocument}
     * @public
     */
    get document ()
    {
        return this._$document;
    }
    set document (document)
    {
        this._$document = document;
    }

    /**
     * @param  {string} path
     * @return {ExternalItem[]|null}
     */
    getItem (path)
    {
        path = `${path}`;

        const workSpace = Util.$currentWorkSpace();
        for (let instance of workSpace._$libraries.values()) {

            if (instance.path !== path) {
                continue;
            }

            return new ExternalItem(instance);
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
            if (instance.folderId) {
                continue;
            }
            items.push(new ExternalItem(instance));
        }

        // 最初はrootなので除外
        items.shift();

        return items;
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
