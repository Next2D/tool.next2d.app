let characterId = 0;

const Util = {};

Util.VERSION                    = 1;
Util.PREFIX                     = "__next2d-tools__";
Util.DATABASE_NAME              = "save-data";
Util.STORE_KEY                  = "local";
Util.STAGE_MIN_SIZE             = 1;
Util.STAGE_MAX_SIZE             = 3000;
Util.FONT_DEFAULT_SIZE          = 200;
Util.FONT_MIN_SIZE              = 10;
Util.FONT_MAX_SIZE              = 255;
Util.FONT_PARAM_MIN_SIZE        = 0;
Util.FONT_PARAM_MAX_SIZE        = 255;
Util.STAGE_DEFAULT_WIDTH        = 550;
Util.STAGE_DEFAULT_HEIGHT       = 400;
Util.STAGE_DEFAULT_FPS          = 24;
Util.STAGE_MIN_FPS              = 1;
Util.STAGE_MAX_FPS              = 60;
Util.STROKE_MIN_SIZE            = 0;
Util.STROKE_MAX_SIZE            = 200;
Util.STAGE_DEFAULT_COLOR        = "#ffffff";
Util.TOOLS_FILL_DEFAULT_COLOR   = "#000000";
Util.TOOLS_STROKE_DEFAULT_COLOR = "#000000";
Util.COLOR_MIN_OFFSET           = -255;
Util.COLOR_MAX_OFFSET           = 255;
Util.COLOR_MIN_MULTIPLIER       = 0;
Util.COLOR_MAX_MULTIPLIER       = 100;
Util.MIN_INT                    = -32768;
Util.MAX_INT                    = 32767;
Util.MIN_ROTATE                 = -360;
Util.MAX_ROTATE                 = 360;
Util.MIN_COLOR                  = 0;
Util.MAX_COLOR                  = 255;
Util.MIN_BLUR                   = 0;
Util.MAX_BLUR                   = 255;
Util.MIN_STRENGTH               = 0;
Util.MAX_STRENGTH               = 255;
Util.MIN_DISTANCE               = -255;
Util.MAX_DISTANCE               = 255;
Util.LAYER_MODE_NORMAL          = 0;
Util.LAYER_MODE_MASK            = 1;
Util.LAYER_MODE_MASK_IN         = 2;
Util.LAYER_MODE_GUIDE           = 3;
Util.LAYER_MODE_GUIDE_IN        = 4;
Util.TIMELINE_DEFAULT_SIZE      = 280;
Util.TIMELINE_MIN_SIZE          = 150;
Util.CONTROLLER_DEFAULT_SIZE    = 360;
Util.REVISION_LIMIT             = 100;
Util.STAGE_SKIP_TARGETA         = 10;
Util.GRADIENT_CANVAS_WIDTH      = 255;
Util.GRADIENT_CANVAS_HEIGHT     = 30;
Util.SCRIPT_MODAL_WIDTH         = 620;
Util.SCRIPT_MODAL_HEIGHT        = 450;
Util.SCRIPT_MODAL_BAR_HEIGHT    = 25;
Util.MIN_VOLUME                 = 0;
Util.MAX_VOLUME                 = 100;
Util.FOLDER_OPEN                = "open";
Util.FOLDER_CLOSE               = "close";
Util.EASE_CANVAS_WIDTH          = 300;
Util.EASE_CANVAS_HEIGHT         = 400;
Util.EASE_BASE_CANVAS_SIZE      = 200;
Util.EASE_MIN_POINTER_X         = 6;
Util.EASE_MIN_POINTER_Y         = -5;
Util.EASE_MAX_POINTER_X         = 306;
Util.EASE_MAX_POINTER_Y         = 395;
Util.EASE_SCREEN_X              = 57;
Util.EASE_SCREEN_Y              = 94;
Util.EASE_MOVE_Y                = 294;
Util.EASE_OFFSET_X              = 50;
Util.EASE_OFFSET_Y              = 100;
Util.EASE_RANGE                 = 100;
Util.DEFAULT_LOOP               = 5;
Util.MIN_ZOOM_LEVEL             = 0.25;
Util.MAX_ZOOM_LEVEL             = 5;
Util.PLUGIN_DEFAULT_WIDTH       = 200;
Util.PLUGIN_DEFAULT_HEIGHT      = 200;
Util.$activeWorkSpaceId         = 0;
Util.$workSpaces                = [];
Util.$readStatus                = 0;
Util.$readEnd                   = 1;
Util.$shiftKey                  = false;
Util.$ctrlKey                   = false;
Util.$zoomScale                 = 1;
Util.$currentFrame              = 1;
Util.$frameWidth                = 65;
Util.$root                      = null;
Util.$Rad2Deg                   = 180 / Math.PI;
Util.$Deg2Rad                   = Math.PI / 180;
Util.$keyLock                   = false;
Util.$activeScript              = false;
Util.$previewMode               = false;
Util.$offsetLeft                = 0;
Util.$offsetTop                 = 0;
Util.$currentCursor             = "auto";
Util.$useIds                    = new Map();
Util.$symbols                   = new Map();
Util.$copyWorkSpaceId           = -1;
Util.$copyLibrary               = null;
Util.$copyLayer                 = null;
Util.$copyCharacter             = null;
Util.$canCopyLayer              = false;
Util.$canCopyCharacter          = false;
Util.$hitColor                  = null;
Util.$updated                   = false;
Util.$languages                 = new Map();
Util.$currentLanguage           = null;
Util.$shapePointerColor         = "#009900";
Util.$shapeLinkedPointerColor   = "#ffa500";
Util.$isMac                     = window.navigator.userAgent.indexOf("Mac") > -1;

const canvas     = document.createElement("canvas");
canvas.width     = 1;
canvas.height    = 1;
Util.$hitContext = canvas.getContext("2d");

Util.$transformTargets = [
    "scale-top-left",
    "scale-top-right",
    "scale-bottom-left",
    "scale-bottom-right",
    "scale-center-left",
    "scale-center-top",
    "scale-center-right",
    "scale-center-bottom",
    "target-rect",
    "target-rotation",
    "reference-point"
];

Util.$gridTargets = [
    "grid-top-left",
    "grid-top-right",
    "grid-bottom-left",
    "grid-bottom-right"
];

/**
 * @type {HTMLImageElement}
 */
Util.$emptyImage = new Image();
Util.$emptyImage.draggable = false;

/**
 * @param  {*}   value
 * @param  {int} min
 * @param  {int} max
 * @return {number}
 * @static
 */
Util.$clamp = function (value, min, max)
{
    const number = +value;
    return Math.min(Math.max(min, isNaN(number) ? 0 : number), max);
};

/**
 * @param  {*} source
 * @return {boolean}
 * @static
 */
Util.$isArray = function (source)
{
    return Array.isArray(source);
};

/**
 * @param  {string} [value="auto"]
 * @return {void}
 * @static
 */
Util.$setCursor = function (value = "auto")
{
    if (Util.$currentCursor !== value) {
        Util.$currentCursor = value;
        document
            .documentElement
            .style
            .setProperty("--tool-cursor", value);
    }
};

/**
 * @description モーダルのアニメーションイベントを登録
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @static
 */
Util.$addModalEvent = (element) =>
{
    const elements = element
        .querySelectorAll("[data-detail]");

    for (let idx = 0; idx < elements.length; ++idx) {

        const element = elements[idx];

        element.addEventListener("mouseover", Util.$fadeIn);
        element.addEventListener("mouseout",  Util.$fadeOut);
    }
};

/**
 * @description モーダルのフェードアウト関数
 *
 * @param  {MouseEvent} event
 * @method
 * @static
 */
Util.$fadeIn = (event) =>
{
    const object = Util.$tools.getUserPublishSetting();
    if ("modal" in object && !object.modal) {
        return ;
    }

    const element = document.getElementById("detail-modal");

    element.textContent = Util.$currentLanguage.replace(
        event.currentTarget.dataset.detail
    );

    // 表示領域に収まるようx座標を調整
    switch (true) {

        case element.clientWidth + event.pageX - 20 > window.innerWidth:
            element.style.left = `${event.pageX - (element.clientWidth + event.pageX + 10 - window.innerWidth)}px`;
            break;

        case 0 > event.pageX - 20:
            element.style.left = "10px";
            break;

        default:
            element.style.left  = `${event.pageX - 20}px`;
            break;

    }

    // 表示領域に収まるようy座標を調整
    switch (true) {

        case element.clientHeight + event.pageY + 20 > window.innerHeight:
            element.style.top = `${event.pageY - element.clientHeight - 20}px`;
            break;

        default:
            element.style.top = `${event.pageY + 20}px`;
            break;

    }

    element.setAttribute("class", "fadeIn");

    // 1.5秒で自動的に消えるようタイマーをセット
    element.dataset.timerId = setTimeout(function ()
    {
        if (!this.classList.contains("fadeOut")) {
            this.setAttribute("class", "fadeOut");
        }
    }.bind(element), 1500);
};

/**
 * @description モーダルのフェードアウト関数
 *
 * @method
 * @static
 */
Util.$fadeOut = () =>
{
    const object = Util.$tools.getUserPublishSetting();
    if ("modal" in object && !object.modal) {
        return ;
    }

    const element = document.getElementById("detail-modal");
    clearTimeout(element.dataset.timerId | 0);
    element.setAttribute("class", "fadeOut");
};

/**
 * @param  {string} ignore
 * @return {void}
 * @static
 */
Util.$endMenu = function (ignore)
{
    const names = [
        "timeline-menu",
        "library-menu",
        "tab-name-menu",
        "timeline-layer-menu",
        "scene-name-menu",
        "user-setting",
        "screen-menu",
        "editor-modal",
        "plugin-modal"
    ];

    for (let idx = 0; idx < names.length; ++idx) {

        const name = names[idx];
        if (name === ignore) {
            continue;
        }

        if (name === "editor-modal"
            && Util.$javaScriptEditor.active
        ) {
            Util.$javaScriptEditor.hide();
        }

        const menu = document.getElementById(name);
        if (!menu.classList.contains("fadeIn")) {
            continue;
        }
        menu.setAttribute("class", "fadeOut");
    }
};

/**
 * @param  {MouseEvent} event
 * @return {void}
 * @static
 */
Util.$changeScene = function (event)
{
    const scenes = document
        .getElementById("scene-name-menu-list");

    while (scenes.children.length) {
        scenes.children[0].remove();
    }

    const workSpace = Util.$currentWorkSpace();

    // add scene
    workSpace.root.addSceneName();

    // fixed logic
    Util.$timelineFrame.currentFrame = 1;

    document
        .getElementById("timeline-marker")
        .style
        .left = "0px";

    const base = document
        .getElementById("timeline-controller-base");

    if (base.scrollLeft) {
        Util.$timelineLayer.moveTimeLine(0);
    }

    // update
    workSpace.scene = workSpace.getLibrary(
        event.currentTarget.dataset.libraryId | 0
    );
};

/**
 * @return {void}
 * @static
 */
Util.$loadSaveData = function ()
{
    const binary = localStorage
        .getItem(`${Util.PREFIX}@${Util.DATABASE_NAME}`);

    if (binary) {

        localStorage
            .removeItem(`${Util.PREFIX}@${Util.DATABASE_NAME}`);

        const length = binary.length;
        const buffer = new Uint8Array(length);
        for (let idx = 0; idx < length; ++idx) {
            buffer[idx] = binary.charCodeAt(idx) & 0xff;
        }

        Util.$unZlibWorker.postMessage({
            "buffer": buffer,
            "type": "local"
        }, [buffer.buffer]);

    } else {

        const request = Util.$launchDB();
        request.onsuccess = (event) =>
        {
            const db = event.target.result;
            const transaction = db.transaction(
                `${Util.DATABASE_NAME}`, "readonly"
            );

            const store = transaction
                .objectStore(`${Util.DATABASE_NAME}`);

            const request = store.get(Util.STORE_KEY);
            request.onsuccess = (event) =>
            {
                const binary = event.target.result;
                if (binary) {

                    const length = binary.length;
                    const buffer = new Uint8Array(length);
                    for (let idx = 0; idx < length; ++idx) {
                        buffer[idx] = binary.charCodeAt(idx) & 0xff;
                    }

                    Util.$unZlibWorker.postMessage({
                        "buffer": buffer,
                        "type": "local"
                    }, [buffer.buffer]);

                } else {

                    Util.$workSpaces.push(new WorkSpace());

                    Util.$screenTab.run();

                    Util.$initializeEnd();

                }

                db.close();
            };
        };
    }
};

/**
 * @param   {Float32Array} a
 * @param   {Float32Array} b
 * @returns {Float32Array}
 * @static
 */
Util.$multiplicationMatrix = function(a, b)
{
    return new Float32Array([
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5]
    ]);
};

/**
 * @param  {KeyboardEvent} event
 * @return {boolean}
 */
Util.$keyCommandFunction = function (event)
{
    Util.$shiftKey = event.shiftKey;
    Util.$ctrlKey  = event.ctrlKey || event.metaKey;

    switch (event.code) {

        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowDown":
        case "ArrowUp":
            if (!Util.$keyLock) {
                event.preventDefault();
                return false;
            }
            break;

        case "KeyS": // save
            if (event.ctrlKey && !event.metaKey
                || !event.ctrlKey && event.metaKey
            ) {
                event.preventDefault();
                Util.$autoSave();
                return false;
            }
            break;

        case "KeyZ": // undo
            if (event.ctrlKey && !event.metaKey
                || !event.ctrlKey && event.metaKey
            ) {
                event.preventDefault();

                // reset
                /**
                 * @type {ArrowTool}
                 */
                const tool = Util.$tools.getDefaultTool("arrow");
                tool.clear();
                Util.$screen.clearTweenMarker();
                Util.$tools.reset();

                if (Util.$currentWorkSpace()) {
                    if (event.shiftKey) {
                        Util
                            .$currentWorkSpace()
                            .redo();
                    } else {
                        Util
                            .$currentWorkSpace()
                            .undo();
                    }
                }

                return false;
            }
            break;

        case "Enter":
            if (event.ctrlKey && !event.metaKey // windows
                || !event.ctrlKey && event.metaKey // mac
            ) {

                if (Util.$previewMode) {
                    return false;
                }

                if (!Util.$keyLock || Util.$keyLock && Util.$activeScript) {
                    event.preventDefault();
                    Util.$showPreview();
                    return false;
                }

            }

            if (!Util.$keyLock && !Util.$activeScript) {

                event.preventDefault();

                if (Util.$timeline._$stopFlag) {
                    Util.$timeline.play();
                } else {
                    Util.$timeline.stop();
                }

            }
            break;

        case "Escape":
            if (Util.$previewMode) {
                event.preventDefault();
                Util.$hidePreview();
                return false;
            }
            break;

    }
};

/**
 * @return {void}
 * @static
 */
Util.$initialize = function ()
{
    // end event
    window.removeEventListener("DOMContentLoaded", Util.$initialize);

    Util.$filterClasses = {
        "BevelFilter": BevelFilter,
        "BlurFilter": BlurFilter,
        "DropShadowFilter": DropShadowFilter,
        "GlowFilter": GlowFilter,
        "GradientBevelFilter": GradientBevelFilter,
        "GradientGlowFilter": GradientGlowFilter
    };

    Util.$languages.set("Japanese", Japanese);
    Util.$languages.set("English", English);
    Util.$languages.set("Chinese", Chinese);
    Util.$languages.set("Korean", Korean);
    Util.$languages.set("French", French);
    Util.$languages.set("Russia", Russia);
    Util.$languages.set("Italiano", Italiano);
    Util.$languages.set("Spanish", Spanish);

    let language = localStorage
        .getItem(`${Util.PREFIX}@language-setting`);

    if (!language) {

        switch (navigator.language) {

            case "ja":
                language = "Japanese";
                break;

            case "ko":
                language = "Korean";
                break;

            case "zh":
                language = "Chinese";
                break;

            case "fr":
                language = "French";
                break;

            case "ru":
                language = "Russia";
                break;

            case "it":
                language = "Italiano";
                break;

            case "es":
                language = "Spanish";
                break;

            default:
                language = "English";
                break;

        }

    }

    const LanguageClass = Util.$languages.get(language);
    Util.$currentLanguage = new LanguageClass();

    // load local data
    Util.$loadSaveData();

    // added event
    window.addEventListener("keydown", Util.$keyCommandFunction);

    // key reset
    window.addEventListener("keyup", () =>
    {
        Util.$shiftKey = false;
        Util.$ctrlKey  = false;
    });

    window.addEventListener("beforeunload", (event) =>
    {
        if (Util.$updated) {

            event.preventDefault();
            event.returnValue = "データ保存中...";

            Util.$autoSave();

        }
    });

    document
        .documentElement
        .style
        .setProperty("--screen-height", `${window.innerHeight - 50}px`);

    const width  = Util.STAGE_DEFAULT_WIDTH;
    const height = Util.STAGE_DEFAULT_HEIGHT;
    const fps    = Util.STAGE_DEFAULT_FPS;

    const previewDisplay = document.getElementById("preview-display");
    if (previewDisplay) {
        previewDisplay.style.width  = `${width}px`;
        previewDisplay.style.height = `${height}px`;
    }

    if ("next2d" in window) {
        Util.$root = window
            .next2d
            .createRootMovieClip(width, height, fps, {
                "tagId": "preview-display"
            });

        Util.$root.stage._$player.stop();
    }

    const previewStop = document.getElementById("preview-stop");
    if (previewStop) {
        previewStop.addEventListener("click", Util.$hidePreview);
    }

    document
        .documentElement
        .style
        .setProperty("--ad", "260px");

    // clear
    Util.$initialize = null;
};
window.addEventListener("DOMContentLoaded", Util.$initialize);

/**
 * @return {void}
 * @static
 */
Util.$showPreview = function ()
{
    Util.$timeline.saveActionScript();

    Util.$previewMode = true;
    Util.$keyLock     = true;

    const element = document.getElementById("player-preview");
    element.style.display = "";
    element.style.zIndex  = "9999";

    const workSpace = Util.$currentWorkSpace();

    const preview = document.getElementById("preview-display");
    preview.style.width  = `${workSpace.stage.width}px`;
    preview.style.height = `${workSpace.stage.height}px`;

    const stopElement = document.getElementById("preview-stop");
    stopElement.style.top  = `${preview.offsetTop - 20}px`;
    stopElement.style.left = `${preview.offsetLeft + workSpace.stage.width}px`;
    stopElement.addEventListener("click", Util.$hidePreview);

    const stage = Util.$root.stage;
    stage.frameRate = document.getElementById("stage-fps").value | 0;

    const player  = stage._$player;
    player.width  = workSpace.stage.width;
    player.height = workSpace.stage.height;

    // fixed logic
    player._$resize();
    stage.clearGlobalVariable();
    stage._$events = new Map();
    player._$broadcastEvents = new Map();

    const json = Publish.toJSON();
    Util.$useIds.clear();

    const { Loader } = window.next2d.display;
    const { URLRequest } = window.next2d.net;
    const { Event } = window.next2d.events;

    const loader = new Loader();

    loader
        .contentLoaderInfo
        .addEventListener(Event.COMPLETE, function (event)
        {
            const loaderInfo = event.currentTarget;

            const stage  = Util.$root.stage;
            const player = stage._$player;
            const data   = loaderInfo._$data;

            player.width  = data.stage.width;
            player.height = data.stage.height;
            player.stage.frameRate = data.stage.fps;

            const color = Util.$intToRGB(
                `0x${data.stage.bgColor.slice(1)}` | 0
            );

            player._$context._$setColor(
                color.R / 255,
                color.G / 255,
                color.B / 255,
                1
            );

            player._$backgroundColor = [
                color.R / 255,
                color.G / 255,
                color.B / 255,
                1
            ];

            Util.$root = null;
            Util.$root = loaderInfo.content;
            while (stage.numChildren) {
                stage.removeChildAt(0);
            }

            stage.addChild(Util.$root);

            player._$cacheStore.reset();

            const { BlendMode } = window.next2d.display;

            const context = player._$context;
            context._$globalAlpha              = 1;
            context._$globalCompositeOperation = BlendMode.NORMAL;
            context._$imageSmoothingEnabled    = false;

            context.frameBuffer.unbind();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context._$bind(player._$buffer);

            player.play();
        });

    loader.load(new URLRequest(
        URL.createObjectURL(new Blob([json], { "type": "application/json" }))
    ));

    // setup clear
    player._$broadcastEvents.clear();
    window.next2d.media.SoundMixer.volume = 1;

    player._$loadStatus = 1;
    player._$updateLoadStatus();
};

/**
 * @return {void}
 * @static
 */
Util.$hidePreview = function ()
{
    const stopElement = document.getElementById("preview-stop");
    stopElement.removeEventListener("click", Util.$hidePreview);

    const element = document.getElementById("player-preview");
    element.style.display = "none";
    element.style.zIndex  = "0";

    Util.$previewMode = false;
    if (!Util.$activeScript) {
        Util.$keyLock = false;
    }

    while (Util.$root.numChildren) {
        Util.$root.removeChild(Util.$root.getChildAt(0));
    }
    Util.$root.stage._$player.stop();
};

/**
 * @return {string}
 * @static
 */
Util.$toJSON = function ()
{
    // cache WorkSpaceId
    const activeWorkSpaceId = Util.$activeWorkSpaceId;

    const children = document
        .getElementById("view-tab-area")
        .children;

    const data = [];
    for (let idx = 0; idx < children.length; ++idx) {

        const node = children[idx];

        const workSpace = Util.$workSpaces[node.dataset.tabId | 0];
        if (!workSpace) {
            continue;
        }

        Util.$activeWorkSpaceId = node.dataset.tabId | 0;

        data.push(workSpace.toJSON());

    }

    // reset
    Util.$activeWorkSpaceId = activeWorkSpaceId;

    return JSON.stringify(data);
};

/**
 * @return {void}
 * @static
 */
Util.$autoSave = function ()
{
    Util.$timeline.saveActionScript();

    const postData = {
        "object": Util.$toJSON(),
        "type": "local"
    };

    if (Util.$zlibWorkerActive) {

        Util.$zlibQueues.push(postData);

    } else {

        Util.$zlibWorkerActive = true;
        Util.$zlibWorker.postMessage(postData);

    }

};

/**
 * @return {WorkSpace}
 * @static
 */
Util.$currentWorkSpace = function ()
{
    return Util.$workSpaces[Util.$activeWorkSpaceId];
};

/**
 * @return {void}
 * @static
 */
Util.$initializeEnd = function ()
{
    Util.$readStatus++;
    if (Util.$readStatus === Util.$readEnd) {

        // HTML内に設定されたdata-detailの値を、モーダル出力するのに登録
        Util.$addModalEvent(document);

        // WorkSpaceを起動
        Util.$currentWorkSpace().run();
    }
};

/**
 * @param {number} id
 * @static
 */
Util.$changeWorkSpace = function (id)
{
    // reset
    Util.$useIds.clear();
    Util.$symbols.clear();

    Util.$currentWorkSpace().stop();

    Util.$activeWorkSpaceId = id | 0;

    Util.$currentWorkSpace().run();
};

// ZLIB Inflate Worker
Util.$unZlibWorker = new Worker(URL.createObjectURL(
    new Blob(["###ZLIB_INFLATE_WORKER###"], { "type": "text/javascript" })
));

/**
 * @param {MessageEvent} event
 * @public
 */
Util.$unZlibWorker.onmessage = function (event)
{
    if (event.data.type === "n2d") {

        const workSpaces = new WorkSpace(decodeURIComponent(event.data.json));

        Util
            .$workSpaces
            .push(workSpaces);

        Util.$screenTab.createElement(workSpaces, Util.$workSpaces.length - 1);

    } else {

        const values = JSON.parse(decodeURIComponent(event.data.json));

        for (let idx = 0; idx < values.length; ++idx) {
            Util.$workSpaces.push(new WorkSpace(values[idx]));
        }

        if (!Util.$workSpaces.length) {
            Util.$workSpaces.push(new WorkSpace());
        }

        // タブセット
        Util.$screenTab.run();

        // end
        Util.$initializeEnd();

    }
};

// ZLIB Deflate Worker
Util.$zlibWorker = new Worker(URL.createObjectURL(
    new Blob(["###ZLIB_DEFLATE_WORKER###"], { "type": "text/javascript" })
));

/**
 * @param {MessageEvent} event
 * @public
 */
Util.$zlibWorker.onmessage = function (event)
{
    const type = event.data.type;
    switch (type) {

        case "json":
        case "n2d":
            {
                const anchor = document.getElementById("save-anchor");
                if (anchor.href) {
                    URL.revokeObjectURL(anchor.href);
                }

                anchor.download = `${Util.$currentWorkSpace().name}.${type}`;

                anchor.href = type === "json"
                    ? URL.createObjectURL(new Blob([event.data.json],   { "type" : "application/json" }))
                    : URL.createObjectURL(new Blob([event.data.buffer], { "type" : "text/plain" }));

                anchor.click();
            }
            break;

        case "local":
            {
                const buffer = event.data.buffer;

                let binary = "";
                for (let idx = 0; idx < buffer.length; idx += 4096) {
                    binary += String.fromCharCode.apply(null, buffer.slice(idx, idx + 4096));
                }

                const request = Util.$launchDB();

                request.onsuccess = (event) =>
                {
                    const db = event.target.result;
                    const transaction = db.transaction(
                        `${Util.DATABASE_NAME}`, "readwrite"
                    );

                    const store = transaction
                        .objectStore(`${Util.DATABASE_NAME}`);

                    store.put(binary, Util.STORE_KEY);

                    transaction.oncomplete = (event) =>
                    {
                        event.target.db.close();
                        Util.$updated = false;
                    };

                    transaction.commit();
                };
            }

            break;

    }

    if (Util.$zlibQueues.length) {

        Util.$zlibWorker.postMessage(Util.$zlibQueues.pop());

    } else {

        Util.$zlibWorkerActive = false;

    }
};

Util.$zlibQueues       = [];
Util.$zlibWorkerActive = false;

// Unzip Worker
Util.$unzipURL = URL.createObjectURL(
    new Blob(["###UNZIP_WORKER###"], { "type": "text/javascript" }
    ));
Util.$unzipWorker       = null;
Util.$unzipQueues       = [];
Util.$unzipWorkerActive = false;

/**
 * @return {IDBOpenDBRequest}
 * @static
 */
Util.$launchDB = function ()
{
    const request = indexedDB.open(
        `${Util.PREFIX}@${Util.DATABASE_NAME}`
    );

    request.onupgradeneeded = (event) =>
    {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(`${Util.DATABASE_NAME}`)) {
            db.createObjectStore(`${Util.DATABASE_NAME}`);
        }
    };

    return request;
};

/**
 * @param  {object} event
 * @return void
 * @static
 */
Util.$unzipHandler = function (event)
{
    const worker = event.target;

    // event end
    worker.onmessage = null;

    // setup
    switch (event.data.mode) {

        case "swf":
            this._$byteStream._$buffer = event.data.buffer;
            this.parseAndBuild();
            break;

        case "lossless":
            {
                const workSpace    = Util.$currentWorkSpace();
                const instance     = workSpace.getLibrary(this.libraryId);
                instance._$buffer  = event.data.buffer;
                instance._$command = null;
            }
            break;

        case "jpegAlpha":
            {
                const buffer    = event.data.buffer;
                const alphaData = event.data.alphaData;

                let index = 0;
                for (let idx = 0; idx < buffer.length; idx += 4) {
                    buffer[idx + 3] = alphaData[index++];
                }

                const workSpace    = Util.$currentWorkSpace();
                const instance     = workSpace.getLibrary(this.libraryId);
                instance._$buffer  = buffer;
                instance._$command = null;
            }
            break;

    }

    // next
    if (Util.$unzipQueues.length) {
        const object = Util.$unzipQueues.shift();
        worker.onmessage = Util.$unzipHandler.bind(object);
        switch (object.mode) {

            case "swf":
                {
                    const buffer = object._$byteStream._$buffer;
                    worker.postMessage({
                        "fileSize": object.fileSize,
                        "mode":     object.mode,
                        "buffer":   buffer
                    }, [buffer.buffer]);
                }
                break;

            case "lossless":
                worker.postMessage(object, [object.buffer.buffer]);
                break;

            case "jpegAlpha":
                worker.postMessage(object, [
                    object.buffer.buffer,
                    object.alphaData.buffer
                ]);
                break;

        }

    } else {

        Util.$unzipWorkerActive = false;

    }

};

Util.$unlzmaWorkerURL = URL.createObjectURL(
    new Blob(["###UNLZMA_WORKER###"], { "type": "text/javascript" })
);
Util.$unlzmaQueues       = [];
Util.$unlzmaWorkerActive = false;

Util.$parserURL = URL.createObjectURL(
    new Blob(["###PARSER_WORKER###"], { "type": "text/javascript" })
);
Util.$parserWorker     = null;
Util.$parserQueues     = [];
Util.$parserWorkerWait = false;

/**
 * @param  {object} event
 * @return void
 * @static
 */
Util.$unlzmaHandler = function (event)
{
    // event end
    event.target.onmessage = null;

    // next
    if (Util.$unlzmaQueues.length) {

        const object = Util.$unlzmaQueues.shift();

        const worker = new Worker(Util.$unlzmaWorkerURL);

        worker.onmessage = Util.$unlzmaHandler.bind(object);

        const data = object._$byteStream._$buffer;
        worker.postMessage({
            "fileSize": object.fileSize,
            "mode":     object.mode,
            "buffer":   data
        }, [data.buffer]);

    } else {

        Util.$unlzmaWorkerActive = false;

    }

    // setup
    this._$byteStream._$buffer = event.data;
    this.parseAndBuild();
};

/**
 * @param  {Uint8Array} data
 * @return {string|null}
 * @static
 */
Util.$getImageType = function (data)
{
    switch (true) {

        // JPEG
        case data[0] === 0xff && data[1] === 0xd8:
            return "jpeg";

        // GIF
        case data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46:
            return "gif";

        // PNG
        case data[0] === 0x89 && data[1] === 0x50 &&
            data[2] === 0x4E && data[3] === 0x47 &&
            data[4] === 0x0D && data[5] === 0x0A &&
            data[6] === 0x1A && data[7] === 0x0A:
            return "png";

        // BMP
        case data[0] === 0x42 && data[1] === 0x4d:
            return "bmp";

        default:
            return null;

    }
};

/**
 * @return {void}
 * @static
 */
Util.$jpegDecodeHandler = function ()
{
    const image  = this.image;
    const width  = image.width;
    const height = image.height;

    const canvas  = document.createElement("canvas");
    canvas.width  = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0, width, height);
    const buffer = new Uint8Array(context
        .getImageData(0, 0, width, height)
        .data);

    // clear
    this.jpegData = null;
    this.image    = null;

    const workSpace = Util.$currentWorkSpace();
    const instance  = workSpace.getLibrary(this.libraryId);
    instance.width  = width;
    instance.height = height;

    if (this.isAlpha) {

        // set
        this.buffer = buffer;
        this.width  = width;
        this.height = height;

        if (Util.$unzipWorkerActive) {
            Util.$unzipQueues.push(this);
            return ;
        }

        Util.$unzipWorkerActive = true;

        if (!Util.$unzipWorker) {
            Util.$unzipWorker = new Worker(Util.$unzipURL);
        }

        const worker = Util.$unzipWorker;
        worker.onmessage = Util.$unzipHandler.bind(this);
        worker.postMessage(this, [
            this.buffer.buffer,
            this.alphaData.buffer
        ]);

    } else {

        instance._$buffer = buffer;

    }
};

/**
 * @type {Map}
 */
Util.$characters = new Map();
Util.$fonts      = new Map();
Util.$texts      = new Map();

/**
 * @param  {object} event
 * @return void
 * @static
 */
Util.$parserHandler = function (event)
{

    const worker = event.target;
    switch (event.data.infoKey) {

        case "character":
            {
                const character = event.data.piece;

                const workSpace = Util.$currentWorkSpace();
                const id = workSpace.nextLibraryId;
                character.libraryId = id;

                switch (character._$name) {

                    case "Shape":
                        {
                            const object = Util
                                .$controller
                                .createContainer("shape", `Shape_${id}`, id);

                            object.recodes  = Util.$vtc.convert(character._$records);
                            object.inBitmap = object.recodes.pop();
                            object.bounds   = {
                                "xMin": character._$bounds.xMin,
                                "xMax": character._$bounds.xMax,
                                "yMin": character._$bounds.yMin,
                                "yMax": character._$bounds.yMax
                            };

                            const shape = workSpace.addLibrary(object);
                            if (this._$folderId) {
                                shape.folderId = this._$folderId;
                            }

                            Util.$characters.set(character._$characterId, id);
                        }
                        break;

                    case "MovieClip":
                        {
                            for (let idx = 0; idx < character._$dictionary.length; ++idx) {
                                const object = character._$dictionary[idx];
                                object.LibraryId = Util.$characters.get(object.CharacterId);
                            }

                            const name = character._$characterId
                                ? `MovieClip_${id}`
                                : this._$fileName;

                            const object = Util
                                .$controller
                                .createContainer("container", name, id);

                            // create MovieClip
                            const movieClip = workSpace.addLibrary(object);
                            if (this._$folderId) {
                                movieClip.folderId = this._$folderId;
                            }

                            // create layer
                            let clipMap = new Map();
                            let layerArray = [];
                            for (let idx = 0; idx < character._$dictionary.length; ++idx) {
                                const tag = character._$dictionary[idx];

                                if (layerArray.indexOf(tag.Depth) !== -1) {
                                    continue;
                                }
                                layerArray.push(tag.Depth);

                                if (tag.ClipDepth) {
                                    clipMap.set(tag.Depth, idx);
                                }

                            }

                            layerArray.sort(function(a, b)
                            {
                                switch (true) {

                                    case a > b:
                                        return 1;

                                    case a < b:
                                        return -1;

                                    default:
                                        return 0;

                                }
                            });

                            // adj clips
                            if (clipMap.size) {

                                for (const [depth, index] of clipMap) {

                                    const moveArray = [];

                                    const tag = character._$dictionary[index];
                                    for (let idx = 0; character._$dictionary.length > idx; ++idx) {

                                        const target = character._$dictionary[idx];
                                        if (target.Depth > tag.ClipDepth) {
                                            break;
                                        }

                                        if (target.Depth > depth) {
                                            moveArray.push(target);
                                        }
                                    }

                                    for (let idx = 0; idx < moveArray.length; ++idx) {

                                        const target = moveArray[idx];

                                        const index = layerArray.indexOf(target.Depth);
                                        const depth = layerArray.splice(index, 1)[0];
                                        const insertIndex = layerArray.indexOf(tag.Depth);

                                        layerArray.splice(insertIndex, 0, depth);
                                    }

                                }
                            }

                            let maskId     = -1;
                            let clipDepth  = -1;
                            const index    = layerArray.length - 1;
                            const layerMap = new Map();
                            const layers   = [];
                            for (let idx = index; idx > -1; --idx) {

                                const layer = new Layer();
                                layer.name  = `Layer_${index - idx}`;

                                const depth = layerArray[idx];
                                if (clipMap.size) {

                                    if (clipDepth > -1) {
                                        if (depth > clipDepth) {
                                            layer.mode   = Util.LAYER_MODE_MASK_IN;
                                            layer.maskId = maskId;
                                        } else {
                                            maskId    = -1;
                                            clipDepth = -1;
                                        }
                                    }

                                    if (clipMap.has(depth)) {
                                        clipDepth  = depth;
                                        maskId     = index - idx;
                                        layer.mode = Util.LAYER_MODE_MASK;
                                    }
                                }

                                layers.push(layer);
                                layerMap.set(depth, layer);
                            }

                            for (let idx = 0; idx < layerArray.length; ++idx) {
                                movieClip.setLayer(idx, layers[idx]);
                            }

                            // setup
                            const characters = [];
                            const totalFrame = character._$controller.length - 1;
                            for (let idx = 0; idx < character._$dictionary.length; ++idx) {

                                const tag = character._$dictionary[idx];

                                const instance = new Character();
                                instance.libraryId  = tag.LibraryId;
                                instance.startFrame = tag.StartFrame;
                                instance.endFrame   = tag.EndFrame || totalFrame + 1;
                                instance.name       = tag.Name || "";

                                characters.push(instance);
                            }

                            const dup = new Map();
                            for (let frame = 1; frame < character._$controller.length; ++frame) {

                                const controller = character._$controller[frame];
                                for (let idx = 0; idx < controller.length; ++idx) {

                                    const id  = controller[idx];
                                    const tag = character._$dictionary[id];

                                    const layer = layerMap.get(tag.Depth);

                                    const instance = characters[id];
                                    if (!dup.has(id)) {
                                        dup.set(id, -1);
                                        layer.addCharacter(instance);
                                    }

                                    const nextId    = character._$placeMap[frame][tag.Depth];
                                    const currentId = dup.get(id);
                                    if (currentId !== nextId) {
                                        const placeObject = character._$placeObjects[nextId];

                                        instance.setPlace(frame, {
                                            "frame": frame,
                                            "depth": 0,
                                            "matrix": placeObject.matrix,
                                            "colorTransform": placeObject.colorTransform,
                                            "blendMode": placeObject.blendMode,
                                            "filter": placeObject.filters ? placeObject.filters : [],
                                            "loop": Util.$getDefaultLoopConfig()
                                        });

                                        dup.set(id, nextId);
                                    }
                                }
                            }

                            for (let idx = 0; idx < layers.length; ++idx) {

                                const layer = layers[idx];
                                for (let frame = 1; frame <= totalFrame; ++frame) {

                                    const instance = layer.getActiveCharacter(frame)[0];
                                    if (instance) {

                                        if (!(frame - 1)) {

                                            layer
                                                ._$frame
                                                .setClasses(frame, ["key-frame"]);

                                        } else {

                                            const classes = layer._$frame.getClasses(frame - 1);
                                            switch (true) {

                                                case classes.indexOf("key-frame") !== -1:

                                                    if (frame === totalFrame) {

                                                        if (instance.hasPlace(frame)) {

                                                            layer._$frame.setClasses(frame, [
                                                                "key-frame"
                                                            ]);

                                                        } else {

                                                            classes.push("key-frame-join");
                                                            layer._$frame.setClasses(frame - 1, classes);

                                                            layer._$frame.setClasses(frame, [
                                                                "key-space-frame-end"
                                                            ]);

                                                        }

                                                    } else {

                                                        if (instance.hasPlace(frame)) {

                                                            layer._$frame.setClasses(frame, [
                                                                "key-frame"
                                                            ]);

                                                        } else {

                                                            classes.push("key-frame-join");
                                                            layer._$frame.setClasses(frame - 1, classes);

                                                            layer._$frame.setClasses(frame, [
                                                                "key-space-frame"
                                                            ]);

                                                        }

                                                    }

                                                    break;

                                                case classes.indexOf("empty-space-frame") !== -1:

                                                    layer._$frame.setClasses(frame - 1, [
                                                        "empty-space-frame-end"
                                                    ]);

                                                    layer._$frame.setClasses(frame, [
                                                        "key-frame"
                                                    ]);

                                                    break;

                                                case classes.indexOf("empty-key-frame") !== -1:
                                                    layer._$frame.setClasses(frame, [
                                                        "key-frame"
                                                    ]);
                                                    break;

                                                default:

                                                    if (frame === totalFrame) {

                                                        layer._$frame.setClasses(frame, [
                                                            "key-space-frame-end"
                                                        ]);

                                                    } else {

                                                        if (instance.hasPlace(frame)) {

                                                            layer._$frame.setClasses(frame - 1, [
                                                                "key-space-frame-end"
                                                            ]);

                                                            layer._$frame.setClasses(frame, [
                                                                "key-frame"
                                                            ]);

                                                        } else {

                                                            layer._$frame.setClasses(frame, [
                                                                "key-space-frame"
                                                            ]);

                                                        }

                                                    }
                                                    break;

                                            }
                                        }

                                    } else {

                                        if (!(frame - 1)) {

                                            layer
                                                ._$frame
                                                .setClasses(frame, ["empty-key-frame"]);

                                        } else {

                                            const classes = layer._$frame.getClasses(frame - 1);
                                            switch (true) {

                                                case classes.indexOf("empty-key-frame") !== -1:

                                                    classes.push("empty-key-frame-join");
                                                    layer._$frame.setClasses(frame - 1, classes);

                                                    if (frame === totalFrame) {

                                                        layer._$frame.setClasses(frame, [
                                                            "empty-space-frame-end"
                                                        ]);

                                                    } else {

                                                        layer._$frame.setClasses(frame, [
                                                            "empty-space-frame"
                                                        ]);

                                                    }

                                                    break;

                                                case classes.indexOf("key-space-frame") !== -1:

                                                    layer._$frame.setClasses(frame - 1, [
                                                        "key-space-frame-end"
                                                    ]);

                                                    layer._$frame.setClasses(frame, [
                                                        "empty-key-frame"
                                                    ]);

                                                    break;

                                                case classes.indexOf("key-frame") !== -1:

                                                    layer._$frame.setClasses(frame, [
                                                        "empty-key-frame"
                                                    ]);

                                                    break;

                                                default:

                                                    if (frame === totalFrame) {

                                                        layer._$frame.setClasses(frame, [
                                                            "empty-space-frame-end"
                                                        ]);

                                                    } else {

                                                        layer._$frame.setClasses(frame, [
                                                            "empty-space-frame"
                                                        ]);

                                                    }

                                                    break;

                                            }
                                        }
                                    }
                                }
                            }

                            Util.$characters.set(character._$characterId, id);
                        }
                        break;

                    case "lossless": // PNG
                        {

                            const object = Util
                                .$controller
                                .createContainer("bitmap", `Bitmap_${id}`, id);

                            character.mode   = "lossless";
                            object.imageType = "image/png";
                            object.buffer    = null;
                            object.width     = character.width;
                            object.height    = character.height;

                            const bitmap = workSpace.addLibrary(object);
                            if (this._$folderId) {
                                bitmap.folderId = this._$folderId;
                            }

                            Util.$characters.set(character._$characterId, id);

                            if (Util.$unzipWorkerActive) {
                                Util.$unzipQueues.push(character);
                                return ;
                            }

                            Util.$unzipWorkerActive = true;

                            if (!Util.$unzipWorker) {
                                Util.$unzipWorker = new Worker(Util.$unzipURL);
                            }

                            const worker = Util.$unzipWorker;
                            worker.onmessage = Util.$unzipHandler.bind(character);
                            worker.postMessage(character, [character.buffer.buffer]);
                        }
                        break;

                    case "imageData": // JPEG,GIF,PNG,etc...
                        {
                            const object = Util
                                .$controller
                                .createContainer("bitmap", `Bitmap_${id}`, id);

                            const imageType     = `image/${Util.$getImageType(character.jpegData)}`;
                            character.mode      = "jpegAlpha";
                            character.imageType = imageType;
                            object.imageType    = imageType;
                            object.buffer       = null;
                            object.width        = 0;
                            object.height       = 0;

                            const bitmap = workSpace.addLibrary(object);
                            if (this._$folderId) {
                                bitmap.folderId = this._$folderId;
                            }

                            Util.$characters.set(character._$characterId, id);

                            character.image = new Image();
                            character.image.decoding = "async";
                            character.image.src = URL.createObjectURL(
                                new Blob([character.jpegData], {
                                    "type": character.imageType
                                })
                            );

                            character.image.decode()
                                .then(Util.$jpegDecodeHandler.bind(character));

                        }
                        break;

                    case "StaticText":
                        {
                            const object = Util
                                .$controller
                                .createContainer("shape", `ShapeText_${id}`, id);

                            object.bounds  = {
                                "xMin": character._$bounds.xMin,
                                "xMax": character._$bounds.xMax,
                                "yMin": character._$bounds.yMin,
                                "yMax": character._$bounds.yMax
                            };

                            const text = workSpace.addLibrary(object);
                            if (this._$folderId) {
                                text.folderId = this._$folderId;
                            }

                            Util.$characters.set(character._$characterId, id);

                            Util.$texts.set(Util.$texts.size, character);
                        }
                        break;

                    case "SimpleButton":
                        {
                            console.log("TODO SimpleButton: ", character);

                            const object = Util
                                .$controller
                                .createContainer("button", `Button_${id}`, id);

                            object.bounds  = {
                                "xMin": character._$bounds.xMin,
                                "xMax": character._$bounds.xMax,
                                "yMin": character._$bounds.yMin,
                                "yMax": character._$bounds.yMax
                            };

                            // workSpace.addLibrary(object);

                            Util.$characters.set(character._$characterId, id);
                        }
                        break;

                    case "TextField":
                        {
                            const object = Util
                                .$controller
                                .createContainer("text", `Text_${id}`, id);

                            object.bounds  = {
                                "xMin": character._$bounds.xMin,
                                "xMax": character._$bounds.xMax,
                                "yMin": character._$bounds.yMin,
                                "yMax": character._$bounds.yMax
                            };

                            // attach
                            object.text          = character._$text;
                            object.inputType     = character._$type;
                            object.color         = character._$textColor;
                            object.font          = character._$defaultTextFormat[1];
                            object.size          = character._$defaultTextFormat[2];
                            object.align         = character._$defaultTextFormat[7];
                            object.leftMargin    = character._$defaultTextFormat[8];
                            object.rightMargin   = character._$defaultTextFormat[9];
                            object.leading       = character._$defaultTextFormat[10];
                            object.multiline     = character._$multiline === 1;
                            object.wordWrap      = character._$wordWrap === 1;
                            object.border        = character._$border === 1;

                            if (character._$defaultTextFormat[4]
                            && character._$defaultTextFormat[5]
                            ) {
                                object.fontType = 3;
                            } else if (character._$defaultTextFormat[4]) {
                                object.fontType = 2;
                            } else if (character._$defaultTextFormat[5]) {
                                object.fontType = 1;
                            }

                            // TODO
                            object.htmlText = character._$htmlText;

                            const text = workSpace.addLibrary(object);
                            if (this._$folderId) {
                                text.folderId = this._$folderId;
                            }

                            Util.$characters.set(character._$characterId, id);
                        }
                        break;

                    default:
                        console.log("TODO: ", character);
                        break;

                }

                if (character._$characterId) {
                    return ;
                }
            }
            break;

        case "font":
            Util.$fonts.set(event.data.index, event.data.piece);
            return;

        case "font_shape":
            {
                const font = Util.$fonts.get(event.data.index);
                font._$glyphShapeTable.push.apply(font._$glyphShapeTable, event.data.pieces);
                Util.$fonts.set(event.data.index, font);
            }
            return;

        case "font_zone":
            {
                const font = Util.$fonts.get(event.data.index);
                font._$zoneTable.push.apply(font._$zoneTable, event.data.pieces);
                Util.$fonts.set(event.data.index, font);
            }
            return;

        default:
            break;

    }

    if (Util.$texts.size) {

        const { Graphics } = window.next2d.display;

        const workSpace = Util.$currentWorkSpace();

        for (const character of Util.$texts.values()) {

            const shape = workSpace.getLibrary(character.libraryId);

            // build shape data
            let offsetX     = 0;
            let offsetY     = 0;
            let color       = null;
            let codeTables  = null;
            let shapeTables = null;
            let textHeight  = 0;
            let isZoneTable = false;

            const baseMatrix = character._$baseMatrix;

            // build shape data
            const records = character._$textRecords;
            for (let idx = 0; idx < records.length; ++idx) {

                const record = records[idx];

                if ("FontId" in record) {
                    const font  = Util.$fonts.get(record.FontId);
                    codeTables  = font._$codeTable;
                    shapeTables = font._$glyphShapeTable;
                    isZoneTable = font._$zoneTable !== null;
                }

                if ("XOffset" in record) {
                    offsetX = record.XOffset;
                }

                if ("YOffset" in record) {
                    offsetY = record.YOffset;
                }

                if ("TextColor" in record) {
                    color = record.TextColor;
                }

                if ("TextHeight" in record) {
                    textHeight = record.TextHeight;
                    if (isZoneTable) {
                        textHeight /= 20;
                    }
                }

                const entries = record.GlyphEntries;
                const count   = record.GlyphCount;
                const scale   = textHeight / 1024;
                for (let idx = 0; idx < count; ++idx) {

                    const entry = entries[idx];
                    const index = entry.GlyphIndex | 0;

                    // add records
                    const shapeRecodes = Util.$vtc.convert({
                        "ShapeData": shapeTables[index],
                        "lineStyles": [],
                        "fillStyles": [{
                            "Color": color,
                            "fillStyleType": 0
                        }]
                    });

                    const matrix = [
                        scale, baseMatrix[1], baseMatrix[2], scale,
                        baseMatrix[4] + offsetX,
                        baseMatrix[5] + offsetY
                    ];

                    for (let idx = 0; idx < shapeRecodes.length;) {

                        const code = shapeRecodes[idx++];
                        shape._$recodes.push(code);
                        switch (code) {

                            case Graphics.MOVE_TO:
                            case Graphics.LINE_TO:
                                {
                                    const x  = shapeRecodes[idx++];
                                    const y  = shapeRecodes[idx++];
                                    const tx = x * matrix[0] + y * matrix[2] + matrix[4];
                                    const ty = x * matrix[1] + y * matrix[3] + matrix[5];
                                    shape._$recodes.push(tx, ty);
                                }
                                break;

                            case Graphics.CURVE_TO:
                                {
                                    const cx  = shapeRecodes[idx++];
                                    const cy  = shapeRecodes[idx++];
                                    const ctx = cx * matrix[0] + cy * matrix[2] + matrix[4];
                                    const cty = cx * matrix[1] + cy * matrix[3] + matrix[5];
                                    shape._$recodes.push(ctx, cty);

                                    const x  = shapeRecodes[idx++];
                                    const y  = shapeRecodes[idx++];
                                    const tx = x * matrix[0] + y * matrix[2] + matrix[4];
                                    const ty = x * matrix[1] + y * matrix[3] + matrix[5];
                                    shape._$recodes.push(tx, ty);
                                }
                                break;

                            case Graphics.FILL_STYLE:
                                shape._$recodes.push(
                                    shapeRecodes[idx++], shapeRecodes[idx++],
                                    shapeRecodes[idx++], shapeRecodes[idx++]
                                );
                                break;

                            case Graphics.BEGIN_PATH:
                            case Graphics.END_FILL:
                                break;

                        }
                    }

                    offsetX += entry.GlyphAdvance;
                }
            }
        }
    }

    // map clear
    Util.$characters.clear();
    Util.$fonts.clear();
    Util.$texts.clear();

    Util
        .$currentWorkSpace()
        .initializeLibrary();

    // parser end
    worker.onmessage = null;

    // next
    if (Util.$parserQueues.length) {

        const object = Util.$parserQueues.shift();

        worker.onmessage = Util.$parserHandler.bind(object);

        const buffer = object._$byteStream._$buffer;
        worker.postMessage({
            "version": object._$swfVersion,
            "offset":  object._$offset,
            "buffer":  buffer
        }, [buffer.buffer]);

    } else {

        Util.$parserWorkerWait = false;

    }

};

/**
 * @param  {object} bounds
 * @param  {Float32Array} matrix
 * @return {object}
 * @method
 * @static
 */
Util.$boundsMatrix = function (bounds, matrix)
{
    const x0 = bounds.xMax * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
    const x1 = bounds.xMax * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
    const x2 = bounds.xMin * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
    const x3 = bounds.xMin * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
    const y0 = bounds.xMax * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
    const y1 = bounds.xMax * matrix[1] + bounds.yMin * matrix[3] + matrix[5];
    const y2 = bounds.xMin * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
    const y3 = bounds.xMin * matrix[1] + bounds.yMin * matrix[3] + matrix[5];

    return {
        "xMin": Math.min( Number.MAX_VALUE, x0, x1, x2, x3),
        "xMax": Math.max(-Number.MAX_VALUE, x0, x1, x2, x3),
        "yMin": Math.min( Number.MAX_VALUE, y0, y1, y2, y3),
        "yMax": Math.max(-Number.MAX_VALUE, y0, y1, y2, y3)
    };
};

/**
 * @param   {number} color
 * @returns {{R: number, G: number, B: number, A: number}}
 * @method
 * @static
 */
Util.$intToRGB = function (color)
{
    return {
        "R": (color & 0xff0000) >> 16,
        "G": (color & 0x00ff00) >> 8,
        "B": color & 0x0000ff
    };
};

/**
 * @param  {number} d
 * @param  {number} sx
 * @param  {number} sy
 * @param  {number} ex
 * @param  {number} ey
 * @param  {array}  curves
 * @return {object}
 */
Util.$getCurvePoint = function (d, sx, sy, ex, ey, curves)
{
    const targets = [];
    for (let idx = 0; idx < curves.length; ++idx) {

        const pointer = curves[idx];

        if (!pointer.usePoint) {
            continue;
        }

        targets.push(pointer);
    }

    if (!targets.length) {
        return null;
    }

    const t = 1 - d;
    const l = targets.length + 1;
    for (let idx = 0; idx < l; ++idx) {
        sx *= t;
        sy *= t;
        ex *= d;
        ey *= d;
    }

    let x = sx + ex;
    let y = sy + ey;
    for (let idx = 0; idx < targets.length; ++idx) {

        const curve = targets[idx];

        const p = idx + 1;

        let cx = curve.x * l;
        let cy = curve.y * l;
        for (let jdx = 0; jdx < p; ++jdx) {
            cx *= d;
            cy *= d;
        }

        for (let jdx = 0; jdx < l - p; ++jdx) {
            cx *= t;
            cy *= t;
        }

        x += cx;
        y += cy;
    }

    return {
        "x": x,
        "y": y
    };
};

/**
 * @param  {object} object
 * @param  {Map}    dup
 * @method
 * @static
 */
Util.$copyContainer = function (object, dup)
{
    const workSpace       = Util.$currentWorkSpace();
    const targetWorkSpace = Util.$workSpaces[Util.$copyWorkSpaceId];

    if (!dup.has(object.id)) {
        dup.set(object.id, workSpace.nextLibraryId);
    }

    object.id = dup.get(object.id);
    workSpace.addLibrary(object);

    for (let idx = 0; idx < object.layers.length; ++idx) {

        const layer = object.layers[idx];
        for (let idx = 0; idx < layer.characters.length; ++idx) {

            const character = layer.characters[idx];
            if (!dup.has(character.libraryId)) {

                dup.set(character.libraryId, workSpace.nextLibraryId);

                const instance = targetWorkSpace
                    .getLibrary(character.libraryId);

                const object = instance.toObject();
                if (object.type === "container") {

                    Util.$copyContainer(object, dup);

                } else {

                    object.id = dup.get(character.libraryId);
                    workSpace.addLibrary(object);

                }
            }

            character.libraryId = dup.get(character.libraryId);
        }
    }

    workSpace.addLibrary(object);
};

/**
 * @return {void}
 * @static
 */
Util.$clearShapePointer = function ()
{
    const element  = document.getElementById("stage-area");
    const children = element.children;
    for (let idx = 0; children.length > idx; ++idx) {

        const node = children[idx];
        if (!node.dataset.shapePointer) {
            continue;
        }

        node.remove();
        --idx;
    }
};

/**
 * @return {void}
 * @static
 */
Util.$clearPenPointer = function ()
{
    const element  = document.getElementById("stage-area");
    const children = element.children;
    for (let idx = 0; children.length > idx; ++idx) {

        const node = children[idx];
        if (!node.dataset.penPointer) {
            continue;
        }

        node.remove();
        --idx;
    }
};

/**
 * @return {object}
 * @static
 */
Util.$getDefaultLoopConfig = function ()
{
    return {
        "type": Util.DEFAULT_LOOP,
        "start": 1,
        "end": 0
    };
};

/**
 * @param  {object} place
 * @param  {number} total_frame
 * @return {number}
 * @static
 */
Util.$getFrame = function (place, total_frame)
{

    const startFrame     = place.startFrame ? place.startFrame : 1;
    const referenceFrame = place.loop ? place.loop.referenceFrame : 0;

    const length = Util.$currentFrame - (referenceFrame || startFrame);

    let frame = 1;
    switch (place.loop.type) {

        case 5:
            frame = 1;
            for (let idx = 0; idx < length; ++idx) {

                ++frame;

                if (frame > total_frame) {
                    frame = 1;
                }

            }
            break;

        case 0:
            {
                const totalFrame = place.loop.end
                    ? place.loop.end
                    : total_frame;

                frame = place.loop.start;

                for (let idx = 0; idx < length; ++idx) {

                    ++frame;

                    if (frame > totalFrame) {
                        frame = place.loop.start;
                    }

                }
            }
            break;

        case 1:
            {
                const totalFrame = place.loop.end
                    ? place.loop.end
                    : total_frame;

                frame = Math.min(totalFrame, length + 1);
            }
            break;

        case 2:
            frame = place.loop.start;
            break;

        case 3:
            {
                const totalFrame = place.loop.end
                    ? place.loop.end
                    : total_frame;

                frame = totalFrame;
                for (let idx = 0; idx < length; ++idx) {
                    --frame;
                    if (!frame) {
                        break;
                    }
                }
                frame = Math.max(place.loop.start, frame);
            }
            break;

        case 4:
            {
                const totalFrame = place.loop.end
                    ? place.loop.end
                    : total_frame;

                frame = totalFrame;
                for (let idx = 0; idx < length; ++idx) {

                    --frame;

                    if (place.loop.start > frame) {
                        frame = totalFrame;
                    }

                }
            }
            break;

    }

    return frame;
};