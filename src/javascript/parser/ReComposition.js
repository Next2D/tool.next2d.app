/**
 * @class
 */
class ReComposition
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$folderId = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$libraryId = 0;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$fileName = "";

        /**
         * @type {ByteStream}
         * @private
         */
        this._$byteStream = new ByteStream();

        /**
         * @type {object}
         * @private
         */
        this._$bounds = {
            "xMin": 0,
            "xMax": 0,
            "yMin": 0,
            "yMax": 0
        };

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$swfVersion = 0;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$info = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$buildData = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fileSize = 0;

        /**
         * @type {string}
         * @default "swf"
         * @private
         */
        this._$mode = "swf";

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offset = 0;
    }

    /**
     * @return {string}
     * @public
     */
    get mode ()
    {
        return this._$mode;
    }

    /**
     * @return {number}
     * @public
     */
    get fileSize ()
    {
        return this._$fileSize;
    }

    /**
     * @param  {Uint8Array} buffer
     * @return {ReComposition}
     * @public
     */
    setData (buffer)
    {
        this._$byteStream.setData(buffer);
        return this;
    }

    /**
     * @param  {string} file_name
     * @param  {number} [folder_id=0]
     * @param  {number} [library_id=0]
     * @return {void}
     * @public
     */
    run (file_name, folder_id = 0, library_id = 0)
    {
        this._$fileName  = file_name.split(".")[0];
        this._$folderId  = folder_id;
        this._$libraryId = library_id;

        // signature
        const signature = this._$byteStream.getHeaderSignature();

        // version
        this._$byteStream.getVersion();

        // file size
        this._$fileSize = this._$byteStream.getUI32();
        this._$mode     = "swf";
        switch (signature) {

            // No ZIP
            case "FWS":
                return this.parseAndBuild();

            // ZLIB
            case "CWS":
                {
                    if (Util.$unzipWorkerActive) {
                        Util.$unzipQueues.push(this);
                        return ;
                    }

                    // start worker
                    Util.$unzipWorkerActive = true;

                    if (!Util.$unzipWorker) {
                        Util.$unzipWorker = new Worker(Util.$unzipURL);
                    }

                    const worker = Util.$unzipWorker;

                    // set message event
                    worker.onmessage = Util.$unzipHandler.bind(this);

                    const data = this._$byteStream._$buffer;
                    worker.postMessage({
                        "fileSize": this._$fileSize,
                        "mode":     this._$mode,
                        "buffer":   data
                    }, [data.buffer]);
                }

                break;

            // LZMA
            case "ZWS":
                {
                    if (Util.$unlzmaWorkerActive) {
                        Util.$unlzmaQueues.push(this);
                        return ;
                    }

                    // start worker
                    Util.$unlzmaWorkerActive = true;

                    const worker = new Worker(Util.$unlzmaWorkerURL);

                    // set message event
                    worker.onmessage = Util.$unlzmaHandler.bind(this);

                    const data = this._$byteStream._$buffer;
                    worker.postMessage({
                        "fileSize": this._$fileSize,
                        "mode":     this._$mode,
                        "buffer":   data
                    }, [data.buffer]);
                }

                break;

            // error
            default:
                throw new Error("this data is not swf.");

        }

    }

    /**
     * @returns void
     * @public
     */
    parseAndBuild ()
    {
        // set stage bounds
        this._$byteStream.byteAlign();

        const nBits = this._$byteStream.getUIBits(5);
        this._$bounds.xMin = this._$byteStream.getSIBits(nBits);
        this._$bounds.xMax = this._$byteStream.getSIBits(nBits);
        this._$bounds.yMin = this._$byteStream.getSIBits(nBits);
        this._$bounds.yMax = this._$byteStream.getSIBits(nBits);

        this._$byteStream.getUI16(); // frameRate
        this._$byteStream.getUI16(); // frameCount

        // current offset
        this._$offset = this._$byteStream._$byteOffset;

        if (Util.$parserWorkerWait) {
            Util.$parserQueues.push(this);
            return ;
        }

        Util.$parserWorkerWait = true;

        if (!Util.$parserWorker) {
            Util.$parserWorker = new Worker(Util.$parserURL);
        }

        Util.$parserWorker.onmessage = Util.$parserHandler.bind(this);

        const buffer = this._$byteStream._$buffer;
        Util.$parserWorker.postMessage({
            "version": this._$swfVersion,
            "offset":  this._$offset,
            "buffer":  buffer
        }, [buffer.buffer]);

    }

    /**
     * @return {MovieClip|DisplayObject}
     * @public
     */
    build ()
    {

        // setup
        const info   = this.buildData.info;
        const object = this.buildData.parent;

        this.loaderInfo._$bytes._$byteArray   = this.buildData.buffer;
        this.loaderInfo._$actionScriptVersion = info._$asv;

        // symbol copy and build
        let isMain = false;
        let length = this.loaderInfo._$symbols.length;
        if (length) {

            const applicationDomain = this.loaderInfo._$applicationDomain;
            const symbols   = Util.$getArray();
            for (let idx = 0; idx < length; ++idx) {

                const symbol = this.loaderInfo._$symbols[idx];

                const id = symbol.tagId;
                if (id === 0) {
                    isMain = true;
                }

                switch (true) {

                    case id in this.loaderInfo._$characters:
                    case this.loaderInfo._$fonts.has(id):
                        {

                            const instance = Util.$getPackage(applicationDomain, symbol.path);
                            if (instance._$loaderInfoId === this.loaderInfo._$id
                                || !("__$$characterId" in instance.prototype)
                            ) {

                                instance.prototype.__$$characterId  = id;
                                instance.prototype.__$$loaderInfoId = this.loaderInfo._$id;

                                const slots = instance.__$$slots;

                                const names  = Util.$Object.keys(slots);
                                const length = names.length;
                                for (let idx = 0; idx < length; ++idx) {

                                    const slot = slots[names[idx]];

                                    if (!slot.__$$classInit) {
                                        continue;
                                    }

                                    slot.__$$classInit();
                                }

                                Util.$poolArray(names);

                            }

                        }
                        break;

                    default:
                        break;

                }

                symbols[id] = symbol.path;
            }

            // set new symbol
            this.loaderInfo._$symbols = symbols;

        }

        // create main
        if (isMain) {

            const main = Util.$buildAVM2(
                this.loaderInfo._$applicationDomain,
                this.loaderInfo._$symbols[0]
            );
            main._$root = main;
            main._$symbolBuild(0, this.loaderInfo._$id, object);

            // init set
            this.loaderInfo._$content = main;

        } else {

            MovieClip._$targetBuild(this.loaderInfo._$content, object);
            this.loaderInfo._$content._$characterBuild();

        }

        // init scenes
        length = info._$sceneInfo.length;
        if (length) {

            const scenes = Util.$getArray();
            for (let idx = 0; idx < length; ++idx) {

                const sceneInfo = info._$sceneInfo[idx];

                // create Scene
                const scene    = new Scene(sceneInfo.name, Util.$getArray(), 1);
                scene._$offset = sceneInfo.offset;

                // set numFrames
                const next = idx + 1 | 0;

                let offset = this.loaderInfo._$content._$totalFrames;
                if (next in info._$sceneInfo) {
                    offset = info._$sceneInfo[next].offset | 0;
                }
                scene._$numFrames = offset - scene._$offset | 0;

                // set labels
                const labels = this.loaderInfo._$content.currentLabels;
                if (labels) {
                    const total  = labels.length;
                    const sceneLabels = Util.$getArray();
                    for (let idx = 0; idx < total; ++idx) {

                        const label = labels[idx];

                        if (label.frame > sceneInfo.offset && label.frame <= offset) {
                            sceneLabels[sceneLabels.length] = label;
                        }

                    }
                    scene._$labels = sceneLabels;
                }

                // set array
                scenes[scenes.length] = scene;

            }

            this.loaderInfo._$content._$scenes = scenes;
        }
    }
}
