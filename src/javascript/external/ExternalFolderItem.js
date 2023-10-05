/**
 * @class
 * @memberOf external
 * @extends {ExternalItem}
 */
class ExternalFolderItem extends ExternalItem
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
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    inItems ()
    {
        const ids = [];
        this._$instance.getInstanceIds(ids);

        const workSpace = this._$document._$workSpace;

        const paths = [];
        for (let idx = 0; idx < ids.length; ++idx) {
            const instance = workSpace.getLibrary(ids[idx]);
            paths.push(instance.path);
        }
        paths.sort((a, b) =>
        {
            const aString = a.toLowerCase();
            const bString = b.toLowerCase();

            if (aString < bString) {
                return -1;
            }

            if (aString > bString) {
                return 1;
            }

            return 0;
        });

        const items = [];
        const library = this._$document.library;
        for (let idx = 0; idx < paths.length; ++idx) {
            items.push(library.getItem(paths[idx]));
        }

        return items;
    }
}