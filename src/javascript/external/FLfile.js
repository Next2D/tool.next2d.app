/**
 * @class
 */
class FLfile
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {Map<any, any>}
         * @private
         */
        this._$folderMap = new Map();

        /**
         * @type {Map<any, any>}
         * @private
         */
        this._$fileMap = new Map();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        this._$folderMap.clear();
        this._$fileMap.clear();
    }

    /**
     * @param  {string} uri
     * @param  {string} text_to_write
     * @return {boolean}
     * @method
     * @public
     */
    write (uri, text_to_write)
    {
        console.log("write: ", uri, text_to_write);
    }

    /**
     * @param  {string} uri
     * @return {boolean}
     * @method
     * @public
     */
    createFolder (uri)
    {
        if (this.exists(uri)) {
            return false;
        }

        const paths = uri.split("/");

        let fileMap   = this._$fileMap;
        let folderMap = this._$folderMap;
        for (let idx = 0; idx < paths.length; ++idx) {

            const path = paths[idx];
            if (folderMap.has(path)) {
                continue;
            }

            fileMap.set(path, new Map());
            folderMap.set(path, new Map());
        }

        return true;
    }

    /**
     * @param  {string} uri
     * @return {boolean}
     * @method
     * @public
     */
    exists (uri)
    {
        const paths = uri.split("/");

        let folderMap = this._$folderMap;
        for (let idx = 0; idx < paths.length; ++idx) {

            const path = paths[idx];
            if (!folderMap.has(path)) {
                return false;
            }

            folderMap = folderMap.get(path);
        }

        return true;
    }

    /**
     * @param  {string} uri
     * @return {boolean}
     * @method
     * @public
     */
    remove (uri)
    {
        const paths = uri.split("/");
        const lastPath = paths.pop();

        let fileMap   = this._$fileMap;
        let folderMap = this._$folderMap;
        for (let idx = 0; idx < paths.length; ++idx) {

            const path = paths[idx];
            if (!folderMap.has(path)) {
                break;
            }

            fileMap   = fileMap.get(path);
            folderMap = folderMap.get(path);
        }

        if (fileMap.has(lastPath)) {
            fileMap.delete(lastPath);
            return true;
        }

        if (folderMap.has(lastPath)) {
            fileMap.delete(lastPath);
            folderMap.delete(lastPath);
            return true;
        }

        return false;
    }
}

window.FLfile = new FLfile();