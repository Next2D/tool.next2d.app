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
        this._$dataMap = new Map();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        this._$dataMap.clear();
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
        const paths = uri.split("/");
        const fileName = paths.pop();

        let dataMap = this._$dataMap;
        for (let idx = 0; idx < paths.length; ++idx) {

            const path = paths[idx];
            if (!dataMap.has(path)) {
                dataMap.set(path, new Map());
            }

            dataMap = dataMap.get(path);
        }

        if (!dataMap.has(fileName)) {
            dataMap.set(fileName, []);
        }

        console.log("write: ", uri);
        console.log(this._$dataMap);
        // console.log(text_to_write);
        dataMap.get(fileName).push(text_to_write);
    }

    /**
     * @param  {string} uri
     * @param  {Uint8Array} buffer
     * @return {boolean}
     * @method
     * @public
     */
    writeBuffer (uri, buffer)
    {
        const paths = uri.split("/");
        const fileName = paths.pop();

        let dataMap = this._$dataMap;
        for (let idx = 0; idx < paths.length; ++idx) {

            const path = paths[idx];
            if (!dataMap.has(path)) {
                dataMap.set(path, new Map());
            }

            dataMap = dataMap.get(path);
        }

        dataMap.set(fileName, buffer);
    }

    /**
     * @param  {string} uri
     * @return {boolean}
     * @method
     * @public
     */
    createFolder (uri)
    {
        const paths = uri.split("/");

        let dataMap = this._$dataMap;
        for (let idx = 0; idx < paths.length; ++idx) {

            const path = paths[idx];
            if (dataMap.has(path)) {
                continue;
            }

            dataMap.set(path, new Map());
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

        let dataMap = this._$dataMap;
        for (let idx = 0; idx < paths.length; ++idx) {

            const path = paths[idx];
            if (!dataMap.has(path)) {
                return false;
            }

            dataMap = dataMap.get(path);
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
        const fileName = paths.pop();

        let dataMap = this._$dataMap;
        for (let idx = 0; idx < paths.length; ++idx) {

            const path = paths[idx];
            if (!dataMap.has(path)) {
                return false;
            }

            dataMap = dataMap.get(path);
        }

        if (!dataMap.has(fileName)) {
            return false;
        }

        dataMap.delete(fileName);

        return true;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    export ()
    {
        const zip = new JSZip();
        this.createZip(zip, this._$dataMap);

        zip
            .generateAsync({ "type" : "blob" })
            .then((content) =>
            {
                const url = URL.createObjectURL(content);

                const anchor    = document.createElement("a");
                anchor.download = `${name}.zip`;
                anchor.href     = url;
                anchor.click();

                URL.revokeObjectURL(url);
            });
    }

    /**
     * @param {JSZip} zip
     * @param {Map} data_map
     * @method
     * @public
     */
    createZip (zip, data_map)
    {
        for (const [name, value] of data_map) {

            console.log(zip, name, value);
            switch (true) {

                case value instanceof Map:
                    this.createZip(zip.folder(name), value);
                    break;

                case value instanceof Uint8Array:
                    zip.file(name, value, { "buffer": true });
                    break;

                case Array.isArray(value):
                    zip.file(name, value.join("\n"));
                    break;

            }

        }
    }
}

window.FLfile = new FLfile();