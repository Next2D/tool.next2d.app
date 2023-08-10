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

        dataMap.get(fileName).push(text_to_write);
    }

    /**
     * @param  {string} uri
     * @param  {string} buffer
     * @return {void}
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
     * @param  {string} base64
     * @return {void}
     * @method
     * @public
     */
    writeBase64 (uri, base64)
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

        dataMap.set(fileName, base64);
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
            if (!dataMap.has(path)) {
                dataMap.set(path, new Map());
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
     * @param  {string} [file_name = "export"]
     * @return {void}
     * @method
     * @public
     */
    export (file_name = "export")
    {
        const zip = new JSZip();
        this.createZip(zip, this._$dataMap);

        zip
            .generateAsync({ "type" : "blob" })
            .then((content) =>
            {
                const url = URL.createObjectURL(content);

                const anchor    = document.createElement("a");
                anchor.download = `${file_name}.zip`;
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

            switch (true) {

                case value instanceof Map:
                    this.createZip(zip.folder(name), value);
                    break;

                case typeof value === "string":
                    zip.file(name, value.split(",")[1], { "base64": true });
                    break;

                case value instanceof Uint8Array:
                    {
                        let ext = "";
                        if (name.indexOf(".mp3") === -1) {
                            ext = ".mp3";
                        }

                        zip.file(`${name}${ext}`, new Blob(
                            [value],
                            { "type": "audio/mp3" }
                        ), { "base64": true });
                    }
                    break;

                case Array.isArray(value):
                    zip.file(name, value.join("\n"));
                    break;

            }

        }
    }
}

window.FLfile = new FLfile();