/**
 * @class
 * @memberOf view.tool
 */
class Publish
{
    /**
     * @return {object}
     * @method
     * @static
     */
    static toObject ()
    {
        const workSpace = Util.$currentWorkSpace();

        const stage = workSpace.stage;
        const libraries = workSpace._$libraries;

        const characters = [];

        // character publish
        for (let [id, instance] of libraries) {

            switch (true) {

                case id === 0: // root
                case instance.type !== "folder": // folder
                case instance.symbol !== "": // symbol instance
                case Util.$useIds.has(id): // use character
                    {
                        const object = instance.toPublish();
                        if (object.symbol) {
                            Util.$symbols.set(object.symbol, characters.length);
                        }

                        characters[id] = object;
                    }
                    break;

                default:
                    characters[id] = null;
                    break;

            }

        }

        let size = Util.$useIds.size;
        for (;;) {

            for (let [id, instance] of libraries) {

                if (characters[id]) {
                    continue;
                }

                if (!Util.$useIds.has(id)) {
                    continue;
                }

                const object = instance.toPublish();
                if (object.symbol) {
                    Util.$symbols.set(object.symbol, characters.length);
                }

                characters[id] = object;
            }

            if (size === Util.$useIds.size) {
                break;
            }

            // update
            size = Util.$useIds.size;
        }

        return {
            "stage": {
                "width": stage.width,
                "height": stage.height,
                "fps": stage.fps,
                "bgColor": stage.bgColor
            },
            "characters": characters
        };
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static toJSON ()
    {
        if (Util.$symbols.size) {
            Util.$symbols.clear();
        }

        const object   = Publish.toObject();
        object.symbols = Array.from(Util.$symbols);
        object.type    = "json";

        return JSON.stringify(object);
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static toZlib ()
    {
        Util.$saveProgress.zlibDeflate();

        if (Util.$symbols.size) {
            Util.$symbols.clear();
        }

        new Promise((resolve) =>
        {
            Util.$saveProgress.createJson();

            setTimeout(() =>
            {
                const object   = Publish.toObject();
                object.symbols = Array.from(Util.$symbols);

                resolve({
                    "object": JSON.stringify(object),
                    "type": "json"
                });

            }, 200);
        })
            .then((data) =>
            {
                Util.$saveProgress.zlibDeflate();

                if (Util.$zlibWorkerActive) {

                    Util.$zlibQueues.push(data);

                } else {

                    Util.$zlibWorkerActive = true;
                    Util.$zlibWorker.postMessage(data);

                }
            });

    }

    /**
     * @return {array}
     * @method
     * @static
     */
    static toWebM ()
    {
        Util.$saveProgress.encode();

        const canvas = document.getElementById("__next2d__").children[0];
        const stream = canvas.captureStream(
            document.getElementById("stage-fps").value | 0
        );

        const chunks   = [];
        const mimeType = "video/webm;codecs=h264";
        const recorder = new MediaRecorder(stream, { "mimeType" : mimeType });

        recorder.addEventListener("dataavailable", (event) =>
        {
            chunks.push(event.data);
        });

        recorder.addEventListener("stop", () =>
        {
            Util.$hidePreview();

            const anchor    = document.getElementById("save-anchor");
            anchor.download = `${Util.$currentWorkSpace().name}.webm`;
            anchor.href     = URL.createObjectURL(new Blob(chunks, { "type" : mimeType }));
            anchor.click();

            Util.$saveProgress.end();
        });

        const watch = function ()
        {
            if (!Util.$root.numChildren) {
                requestAnimationFrame(watch);
                return ;
            }

            if (Util.$root.currentFrame >= Util.$root.totalFrames) {
                return recorder.stop();
            }

            requestAnimationFrame(watch);
        };
        watch();

        Util.$showPreview();
        recorder.start(0);
    }

    /**
     * @param  {number} [repeat=0]
     * @return {void}
     * @method
     * @static
     */
    static toGIF (repeat = 0)
    {
        Util.$saveProgress.encode();

        const gif = new GIF({
            "repeat": repeat,
            "workerScript": "./assets/js/gif.worker.js"
        });

        gif.on("finished", (blob) =>
        {
            const anchor    = document.getElementById("save-anchor");
            anchor.download = `${Util.$currentWorkSpace().name}.gif`;
            anchor.href     = URL.createObjectURL(blob);
            anchor.click();

            Util.$saveProgress.end();
        });

        const watch = function ()
        {
            if (!Util.$root.numChildren) {
                requestAnimationFrame(watch);
                return ;
            }

            const canvas = document.getElementById("__next2d__").children[0];

            const cloneCanvas  = document.createElement("canvas");
            cloneCanvas.width  = canvas.width;
            cloneCanvas.height = canvas.height;

            const context = cloneCanvas.getContext("2d");
            context.drawImage(canvas, 0, 0, canvas.width, canvas.height);

            gif.addFrame(context.canvas, { "delay": 20 });

            if (Util.$root.currentFrame >= Util.$root.totalFrames) {
                Util.$hidePreview();
                gif.render();
                return;
            }

            requestAnimationFrame(watch);
        };
        watch();

        Util.$showPreview();
    }

    /**
     * @return {void}
     * @method
     * @static
     */
    static toPng ()
    {
        Util.$saveProgress.encode();

        const snapshot = () =>
        {
            if (!Util.$root.numChildren) {
                requestAnimationFrame(snapshot);
                return ;
            }

            const stage = Util.$root.stage;
            if (!stage) {
                requestAnimationFrame(snapshot);
                return ;
            }

            const player = stage._$player;
            if (player._$stopFlag) {
                requestAnimationFrame(snapshot);
                return ;
            }

            const canvas    = document.getElementById("__next2d__").children[0];
            const anchor    = document.getElementById("save-anchor");
            anchor.download = `${Util.$currentWorkSpace().name}.png`;
            anchor.href     = canvas.toDataURL();
            anchor.click();

            Util.$saveProgress.end();

            Util.$hidePreview();
        };
        snapshot();

        Util.$showPreview();
    }

    /**
     * @param  {boolean} [loop = true]
     * @return {void}
     * @method
     * @static
     */
    static toApng (loop = true)
    {
        Util.$saveProgress.encode();

        const buffer = [];
        let currentFrame = 0;
        const watch = () =>
        {
            const player = Util.$root.stage._$player;
            if (player._$stopFlag
                || !Util.$root.numChildren
                || currentFrame === Util.$root.currentFrame
            ) {
                requestAnimationFrame(watch);
                return ;
            }

            currentFrame = Util.$root.currentFrame;
            const canvas = document.getElementById("__next2d__").children[0];

            const cloneCanvas  = document.createElement("canvas");
            cloneCanvas.width  = canvas.width;
            cloneCanvas.height = canvas.height;

            canvas.toBlob((blob) =>
            {
                buffer.push(blob);

                if (buffer.length === Util.$root.totalFrames) {

                    Util.$hidePreview();

                    return new ApngEncoder(
                        buffer, canvas.width, canvas.height,
                        document.getElementById("stage-fps").value | 0,
                        loop
                    )
                        .encode()
                        .then((blob) =>
                        {
                            const anchor    = document.getElementById("save-anchor");
                            anchor.download = `${Util.$currentWorkSpace().name}.apng`;
                            anchor.href     = URL.createObjectURL(blob);
                            anchor.click();

                            Util.$saveProgress.end();
                        });

                }
            });

            if (Util.$root.currentFrame >= Util.$root.totalFrames) {
                return ;
            }

            requestAnimationFrame(watch);
        };
        watch();

        Util.$showPreview();
    }

}
