/**
 * @type {number}
 * @default 0
 */
let characterId = 0;

const Util = {};

Util.VERSION                  = 1;
Util.PREFIX                   = "__next2d-tools__";
Util.DATABASE_NAME            = "save-data";
Util.STORE_KEY                = "local";
Util.REVISION_LIMIT           = 100;
Util.$activeWorkSpaceId       = 0;
Util.$activeCharacterIds      = [];
Util.$workSpaces              = [];
Util.$readStatus              = 0;
Util.$readEnd                 = 1;
Util.$shiftKey                = false;
Util.$ctrlKey                 = false;
Util.$altKey                  = false;
Util.$zoomScale               = 1.0;
Util.$currentFrame            = 1;
Util.$root                    = null;
Util.$Rad2Deg                 = 180 / Math.PI;
Util.$Deg2Rad                 = Math.PI / 180;
Util.$keyLock                 = false;
Util.$activeScript            = false;
Util.$previewMode             = false;
Util.$offsetLeft              = 0;
Util.$offsetTop               = 0;
Util.$currentCursor           = "auto";
Util.$useIds                  = new Map();
Util.$symbols                 = new Map();
Util.$copyWorkSpaceId         = -1;
Util.$copyLibrary             = null;
Util.$copyLayer               = null;
Util.$copyCharacter           = null;
Util.$canCopyLayer            = false;
Util.$canCopyCharacter        = false;
Util.$hitColor                = null;
Util.$updated                 = false;
Util.$languages               = new Map();
Util.$currentLanguage         = null;
Util.$shapePointerColor       = "#009900";
Util.$shapeLinkedPointerColor = "#ffa500";
Util.$shortcut                = new Map();
Util.$globalShortcut          = new Map();
Util.$useShortcutSetting      = false;
Util.$changeLibraryId         = 0;
Util.$canvases                = [];
Util.$sleepCanvases           = [];

const userAgentData = window.navigator.userAgentData;
if (userAgentData) {
    userAgentData
        .getHighEntropyValues(["platform"])
        .then((object) =>
        {
            Util.$isMac = object.platform.indexOf("mac") > -1;
        });
} else {
    Util.$isMac = window.navigator.userAgent.indexOf("Mac") > -1;
}

const canvas     = document.createElement("canvas");
canvas.width     = 1;
canvas.height    = 1;
Util.$hitContext = canvas.getContext("2d");

Util.$useOffscreenCanvas = "transferControlToOffscreen" in canvas;

/**
 * @return {HTMLCanvasElement}
 * @static
 */
Util.$getCanvas = () =>
{
    return Util.$canvases.length
        ? Util.$canvases.shift()
        : document.createElement("canvas");
};

/**
 * @param {HTMLCanvasElement} canvas
 * @static
 */
Util.$poolCanvas = (canvas) =>
{
    if (!(canvas instanceof HTMLCanvasElement)) {
        return ;
    }

    // canvas reset
    canvas.width = canvas.height = 1;

    // pool
    canvas.setAttribute("class", "");
    canvas.setAttribute("style", "");
    Util.$canvases.push(canvas);
};

Util.$cloneMovieClip = (from_work_space_id, movie_clip) =>
{
    const fromWorkSpace = Util.$workSpaces[from_work_space_id];
    const toWorkSpace   = Util.$currentWorkSpace();

    const activeWorkSpaceId = Util.$activeWorkSpaceId;
    Util.$activeWorkSpaceId = this._$copyWorkSpaceId;

    const movieClip = movie_clip.clone();
    Util.$activeWorkSpaceId = activeWorkSpaceId;

    for (const layer of movieClip._$layers.values()) {

        // 設置されたレイヤーを複製
        const newLayer = new Layer();
        for (let idx = 0; idx < layer._$characters.length; ++idx) {

            // 複製先でIDを発番するのでtoObjectを利用する
            Util.$activeWorkSpaceId = from_work_space_id;
            const character = new Character(
                JSON.parse(JSON.stringify(layer._$characters[idx].toObject()))
            );

            // 初期化
            character._$id = toWorkSpace._$characterId++;

            Util.$activeWorkSpaceId = activeWorkSpaceId;

            const instance = fromWorkSpace
                .getLibrary(character.libraryId);

            if (this._$copyMapping.has(instance.id)) {
                character.libraryId = this._$copyMapping.get(instance.id);
                newLayer.addCharacter(character);
                continue;
            }

            if (instance.folderId) {

                const folders = [];

                let parent = instance;
                while (parent._$folderId) {
                    parent = fromWorkSpace.getLibrary(
                        parent._$folderId
                    );
                    folders.unshift(parent);
                }

                for (let idx = 0; folders.length > idx; ++idx) {

                    const folder = folders[idx];

                    const path = folder
                        .getPathWithWorkSpace(fromWorkSpace);

                    if (toWorkSpace._$nameMap.has(path)) {

                        if (!this._$instanceMap.has(folder.id)) {
                            this._$instanceMap.set(folder.id, []);
                        }

                        this._$instanceMap
                            .get(folder.id)
                            .push({
                                "layer": null,
                                "path": path,
                                "character": folder
                            });

                        continue;
                    }

                    const clone = folder.clone();

                    const id = toWorkSpace.nextLibraryId;
                    this._$copyMapping.set(clone.id, id);

                    clone._$id = id;
                    if (clone.folderId
                        && this._$copyMapping.has(clone.folderId)
                    ) {
                        clone.folderId = this
                            ._$copyMapping
                            .get(clone.folderId);
                    }

                    toWorkSpace._$libraries.set(clone.id, clone);

                    Util
                        .$libraryController
                        .createInstance(
                            clone.type,
                            clone.name,
                            clone.id,
                            clone.symbol
                        );

                }
            }

            // コピー元のワークスペースからpathを算出
            const path = instance
                .getPathWithWorkSpace(fromWorkSpace);

            if (toWorkSpace._$nameMap.has(path)) {

                if (!this._$instanceMap.has(instance.id)) {
                    this._$instanceMap.set(instance.id, []);
                }

                this._$instanceMap
                    .get(instance.id)
                    .push({
                        "layer": newLayer,
                        "path": path,
                        "character": character
                    });

                continue;
            }

            // fixed logic 複製を生成
            const clone = instance.type === InstanceType.MOVIE_CLIP
                ? this.cloneMovieClip(instance)
                : instance.clone();

            // ライブラリにアイテムを追加
            const id = toWorkSpace.nextLibraryId;
            this._$copyMapping.set(instance.id, id);

            character.libraryId = id;
            clone._$id = id;
            toWorkSpace._$libraries.set(clone.id, clone);

            if (clone.folderId
                && this._$copyMapping.has(clone.folderId)
            ) {
                clone.folderId = this
                    ._$copyMapping
                    .get(clone.folderId);
            }

            Util
                .$libraryController
                .createInstance(
                    clone.type,
                    clone.name,
                    clone.id,
                    clone.symbol
                );

            toWorkSpace
                ._$nameMap
                .set(path, clone.id);

            newLayer.addCharacter(character);
        }

        // 空のキーフレームをコピー
        for (let idx = 0; idx < layer._$emptys.length; ++idx) {
            newLayer.addEmptyCharacter(
                layer._$emptys[idx].clone()
            );
        }

        newLayer.id = layer.id;
        movieClip.setLayer(newLayer.id, newLayer);
    }

    return movieClip;
};

/**
 * @param  {*}   value
 * @param  {int} min
 * @param  {int} max
 * @return {number}
 * @static
 */
Util.$clamp = (value, min, max) =>
{
    const number = +value;
    return Math.min(Math.max(min, isNaN(number) || !isFinite(number) ? 0 : number), max);
};

/**
 * @param  {string} key
 * @param  {object} [options=null]
 * @return {string}
 * @static
 */
Util.$generateShortcutKey = (key, options = null) =>
{
    let value = key.length === 1 ? key.toLowerCase() : key;
    if (options) {
        if (options.shift) {
            value += "Shift";
        }
        if (options.alt) {
            value += "Alt";
        }
        if (options.ctrl) {
            value += "Ctrl";
        }
    }
    return value;
};

/**
 * @param  {*} source
 * @return {boolean}
 * @static
 */
Util.$isArray = (source) =>
{
    return Array.isArray(source);
};

/**
 * @param  {string} [value="auto"]
 * @return {void}
 * @static
 */
Util.$setCursor = (value = "auto") =>
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
    const object = Util.$userSetting.getPublishSetting();
    if ("modal" in object && !object.modal) {
        return ;
    }

    const target = event.currentTarget;

    let value = Util.$currentLanguage.replace(
        target.dataset.detail
    );

    let shortcutKey = target.dataset.shortcutKey;
    if (shortcutKey) {

        const mapping = Util.$shortcutSetting.viewMapping.get(
            target.dataset.area
        );

        const shortcutText = mapping.has(shortcutKey)
            ? mapping.get(shortcutKey).text
            : target.dataset.shortcutText;

        value += ` (${shortcutText})`;
    }

    const element = document.getElementById("detail-modal");
    if (element.textContent !== value) {
        element.textContent = value;
    }

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
    element.dataset.timerId = setTimeout(() =>
    {
        if (!element.classList.contains("fadeOut")) {
            element.setAttribute("class", "fadeOut");
        }
    }, 1500);
};

/**
 * @description モーダルのフェードアウト関数
 *
 * @method
 * @static
 */
Util.$fadeOut = () =>
{
    const object = Util.$userSetting.getPublishSetting();
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
Util.$endMenu = (ignore) =>
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
        "plugin-modal",
        "shortcut-setting-menu",
        "library-export-modal",
        "screen-order-menu",
        "screen-align-menu",
        "change-movie-clip"
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
 * @return {void}
 * @static
 */
Util.$loadSaveData = () =>
{
    Util.$saveProgress.start();

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

        Util.$saveProgress.zlibInflate();

        Util.$unZlibWorker.postMessage({
            "buffer": buffer,
            "type": "local"
        }, [buffer.buffer]);

    } else {

        Util.$saveProgress.launchDatabase(10);

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

                    Util.$saveProgress.zlibInflate();

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
Util.$multiplicationMatrix = (a, b) =>
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
 * @description 画面全体のショートカットを登録
 *
 * @param  {string} code
 * @param  {function} callback
 * @return {void}
 * @method
 * @static
 */
Util.$setShortcut = (code, callback) =>
{
    Util.$shortcut.set(code, callback);
};

/**
 * @description 画面全体のショートカットを登録
 *
 * @param  {string} code
 * @param  {function} callback
 * @return {void}
 * @method
 * @static
 */
Util.$setGlobalShortcut = (code, callback) =>
{
    Util.$globalShortcut.set(code, callback);
};

/**
 * @description ショートカットを削除
 *
 * @param  {string} code
 * @return {void}
 * @method
 * @static
 */
Util.$deleteShortcut = (code) =>
{
    if (!Util.$shortcut.has(code)) {
        return ;
    }
    Util.$shortcut.delete(code);
};

/**
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @static
 */
Util.$executeKeyCommand = (event) =>
{
    Util.$shiftKey = event.shiftKey;
    Util.$ctrlKey  = event.ctrlKey || event.metaKey; // command
    Util.$altKey   = event.altKey;

    if (Util.$ctrlKey) {

        switch (event.key) {

            case "-":
            case "+":
            case ";":
                event.stopPropagation();
                event.preventDefault();
                break;

            default:
                break;

        }

    }

    const code = Util.$generateShortcutKey(event.key, {
        "alt": Util.$altKey,
        "shift": Util.$shiftKey,
        "ctrl": Util.$ctrlKey
    });

    if (Util.$globalShortcut.has(code)) {
        event.stopPropagation();
        event.preventDefault();
        Util.$globalShortcut.get(code)(event);
        return ;
    }

    if (Util.$keyLock) {
        return ;
    }

    if (Util.$useShortcutSetting) {
        event.stopPropagation();
        event.preventDefault();
        return ;
    }

    if (!Util.$shortcut.has(code)) {
        return ;
    }

    event.stopPropagation();
    event.preventDefault();
    Util.$shortcut.get(code)(event);
};

/**
 * @description AudioContextを起動
 */
Util.$loadAudioContext = () =>
{
    window.removeEventListener("click", Util.$loadAudioContext);
    Util.$audioContext = new AudioContext();

    if ("next2d" in window) {
        Util.$root.stage._$player._$loadWebAudio();
    }
};

/**
 * @return {void}
 * @static
 */
Util.$initialize = () =>
{
    if ("Raven" in window) {
        Raven.config(
            "https://ebbc692644d14dddaa6f6fec5a9a2dc6@o4504829779705856.ingest.sentry.io/4504829782458368"
        ).install();

        // eslint-disable-next-line no-unused-vars
        window.onerror = (message, file, line, col, error) =>
        {
            Raven.captureException(error);
        };
    }

    // end event
    window.removeEventListener("DOMContentLoaded", Util.$initialize);

    // clickでAudioContextを起動
    window.addEventListener("mousedown", Util.$loadAudioContext);

    // ブラウザを離れる時は初期化
    document.body.addEventListener("mouseleave", () =>
    {
        Util.$shiftKey = false;
        Util.$ctrlKey  = false;
        Util.$altKey   = false;
    });

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

    const width  = Stage.STAGE_DEFAULT_WIDTH;
    const height = Stage.STAGE_DEFAULT_HEIGHT;
    const fps    = Stage.STAGE_DEFAULT_FPS;

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

        const { LoaderInfo } = window.next2d.display;
        Util.$loaderInfo = new LoaderInfo();
    }
    // load local data
    Util.$loadSaveData();

    // added event
    window.addEventListener("keydown", Util.$executeKeyCommand);

    // key reset
    window.addEventListener("keyup", () =>
    {
        Util.$shiftKey = false;
        Util.$ctrlKey  = false;
        Util.$altKey   = false;
    });

    window.addEventListener("beforeunload", (event) =>
    {
        if (Util.$updated) {

            event.preventDefault();
            event.stopPropagation();

            event.returnValue = "データ保存中...";

            // 保存を実行
            Util.$autoSave();

            return false;
        }
    });

    // フレームのデフォルト幅をセット
    document
        .documentElement
        .style
        .setProperty(
            "--timeline-frame-width",
            `${TimelineTool.DEFAULT_TIMELINE_WIDTH}px`
        );

    document
        .documentElement
        .style
        .setProperty(
            "--timeline-frame-height",
            `${TimelineTool.DEFAULT_TIMELINE_HEIGHT - 1}px`
        );

    document
        .documentElement
        .style
        .setProperty("--screen-height", `${window.innerHeight - 50}px`);

    const previewStop = document.getElementById("preview-stop");
    if (previewStop) {
        previewStop.addEventListener("click", Util.$hidePreview);
    }

    document
        .documentElement
        .style
        .setProperty("--ad", "280px");

    // clear
    Util.$initialize = null;
};
window.addEventListener("DOMContentLoaded", Util.$initialize);
window.addEventListener("resize", () =>
{
    if (Util.$saveProgress.active) {
        return ;
    }

    Util.$rebuildTimeline();
    Util.$rebuildRuler();
});

/**
 * @description 定規を現在のスケールで再構成
 *
 * @method
 * @static
 */
Util.$rebuildRuler = () =>
{
    const workSpace = Util.$currentWorkSpace();
    if (workSpace._$rulerX.length || workSpace._$rulerY.length) {
        Util.$screenRuler.rebuild();
    }
};

/**
 * @description タイムラインを現在の幅で再構成
 *
 * @method
 * @static
 */
Util.$rebuildTimeline = () =>
{
    // ヘッダーを再構成
    Util.$timelineHeader._$currentFrame = -1;
    Util.$timelineHeader.setWidth();
    Util.$timelineHeader.rebuild();

    // タイムラインを再構成
    Util.$timelineMarker.resetMarker();
    Util.$timelineLayer.moveTimeLine();
    Util.$timelineLayer.updateClientSize();
};

/**
 * @return {void}
 * @static
 */
Util.$showPreview = () =>
{
    // タイムライン側を停止
    Util
        .$timelinePlayer
        .executeTimelineStop();

    Util.$javaScriptEditor.save();

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
    const player  = stage._$player;

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
        .addEventListener(Event.COMPLETE, (event) =>
        {
            const loaderInfo = event.currentTarget;

            const stage  = Util.$root.stage;
            const player = stage._$player;
            const data   = loaderInfo._$data;

            player.width  = data.stage.width;
            player.height = data.stage.height;
            player.stage._$frameRate = data.stage.fps;

            // fixed logic
            player._$resize();

            while (stage.numChildren) {
                stage.removeChildAt(0);
            }

            Util.$root = null;
            Util.$root = loaderInfo.content;
            stage.addChild(Util.$root);

            player._$setBackgroundColor(
                `0xff${data.stage.bgColor.slice(1)}` | 0
            );

            player._$cacheStore.reset();
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
Util.$hidePreview = () =>
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

    const root = Util.$root;
    const player = root.stage._$player;
    while (Util.$root.numChildren) {
        root.removeChildAt(0);
    }

    player._$setBackgroundColor();
    player.stop();
};

/**
 * @return {string}
 * @static
 */
Util.$toJSON = () =>
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
 * @return {Promise}
 * @static
 */
Util.$autoSave = () =>
{
    if (Util.$saveProgress.active) {
        return Promise.resolve();
    }

    Util.$javaScriptEditor.save();
    Util.$saveProgress.start();

    return new Promise((resolve) =>
    {
        Util.$saveProgress.createJson();

        setTimeout(() =>
        {
            resolve({
                "object": Util.$toJSON(),
                "type": "local"
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

};

/**
 * @param   {array} matrix
 * @returns {array}
 * @method
 * @static
 */
Util.$inverseMatrix = (matrix) =>
{
    const tx = matrix[2] * matrix[5] - matrix[3] * matrix[4];
    const ty = matrix[1] * matrix[4] - matrix[0] * matrix[5];

    let det = matrix[0] * matrix[3] - matrix[2] * matrix[1];
    if (!det || !isFinite(det)) {
        return [
            matrix[3],
            -matrix[1],
            -matrix[2],
            matrix[0] ,
            tx,
            ty
        ];
    }

    const rdet = 1 / det;
    return [
        matrix[3] * rdet,
        -matrix[1] * rdet,
        -matrix[2] * rdet,
        matrix[0] * rdet,
        tx * rdet,
        ty * rdet
    ];
};

/**
 * @param  {number} num
 * @return {number}
 */
Util.$toFixed4 = (num) =>
{
    const value = num.toString();
    const index = value.indexOf("e");
    if (index > -1) {
        num = +value.slice(0, index);
    }
    return +num.toFixed(4);
};

/**
 * @return {WorkSpace}
 * @static
 */
Util.$currentWorkSpace = () =>
{
    return Util.$workSpaces[Util.$activeWorkSpaceId];
};

/**
 * @return {void}
 * @static
 */
Util.$initializeEnd = () =>
{
    Util.$readStatus++;
    if (Util.$readStatus === Util.$readEnd) {

        // ローディング演出終了
        Util.$saveProgress.end();

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
Util.$changeWorkSpace = (id) =>
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
Util.$unZlibWorker.onmessage = (event) =>
{
    if (event.data.type === "n2d") {

        Util.$saveProgress.loadN2D();

        const workSpaces = new WorkSpace(
            decodeURIComponent(event.data.json)
        );

        workSpaces.name = event.data.name;

        Util
            .$workSpaces
            .push(workSpaces);

        Util
            .$screenTab
            .createElement(workSpaces, Util.$workSpaces.length - 1);

        Util.$saveProgress.end();

    } else {

        Util.$saveProgress.loadJson();

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
Util.$zlibWorker.onmessage = (event) =>
{
    const type = event.data.type;
    switch (type) {

        case "json":
        case "n2d":
            Util.$saveProgress.createFile();

            setTimeout(() =>
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

                Util.$saveProgress.end();

            }, 200);
            break;

        case "local":
            {
                const buffer = event.data.buffer;

                new Promise((resolve) =>
                {
                    window.requestAnimationFrame(() =>
                    {
                        Util.$saveProgress.createBinary();

                        let binary = "";
                        for (let idx = 0; idx < buffer.length; idx += 4096) {
                            binary += String.fromCharCode.apply(
                                null, buffer.slice(idx, idx + 4096)
                            );
                        }

                        resolve(binary);
                    });
                })
                    .then((data) =>
                    {

                        Util.$saveProgress.launchDatabase(90);

                        const request = Util.$launchDB();

                        request.onsuccess = (event) =>
                        {
                            const db = event.target.result;
                            const transaction = db.transaction(
                                `${Util.DATABASE_NAME}`, "readwrite"
                            );

                            const store = transaction
                                .objectStore(`${Util.DATABASE_NAME}`);

                            store.put(data, Util.STORE_KEY);

                            transaction.oncomplete = (event) =>
                            {
                                event.target.db.close();
                                Util.$updated = false;
                                Util.$saveProgress.end();
                            };

                            Util.$saveProgress.commit();
                            transaction.commit();
                        };
                    });
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
Util.$launchDB = () =>
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
 * @description 全てのエリアのコピーを初期化
 * @return {void}
 * @static
 */
Util.$allClearCopy = () =>
{
    Util.$timelineMenu.clearCopy();
    Util.$screenMenu.clearCopy();
    Util.$libraryMenu.clearCopy();
};

/**
 * @param  {Uint8Array} data
 * @return {string|null}
 * @static
 */
Util.$getImageType = (data) =>
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
Util.$jpegDecodeHandler = () =>
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
Util.$symbols    = new Map();
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
                                .$libraryController
                                .createInstance(InstanceType.SHAPE, `Shape_${id}`, id);

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

                            let libraryId = !character._$characterId && this._$libraryId
                                ? this._$libraryId
                                : id;

                            const object = Util
                                .$libraryController
                                .createInstance(InstanceType.MOVIE_CLIP, name, libraryId);

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

                            layerArray.sort((a, b) =>
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
                                            layer.mode   = LayerMode.MASK_IN;
                                            layer.maskId = maskId;
                                        } else {
                                            maskId    = -1;
                                            clipDepth = -1;
                                        }
                                    }

                                    if (clipMap.has(depth)) {
                                        clipDepth  = depth;
                                        maskId     = index - idx;
                                        layer.mode = LayerMode.MASK;
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

                                const empty = {
                                    "startFrame": -1
                                };

                                const layer = layers[idx];
                                for (let frame = 1; frame <= totalFrame; ++frame) {

                                    const characters = layer.getActiveCharacter(frame);

                                    // 空白のフレーム処理
                                    if (!characters.length) {

                                        if (empty.startFrame === -1) {
                                            empty.startFrame = frame;
                                        }

                                    } else {

                                        // 空白のフレームがあれば登録して初期化
                                        if (empty.startFrame > 0) {
                                            layer.addEmptyCharacter(new EmptyCharacter({
                                                "startFrame": empty.startFrame,
                                                "endFrame": frame
                                            }));

                                            // 初期化
                                            empty.startFrame = -1;
                                        }

                                    }
                                }
                            }

                            // 連続するplace objectをtweenに変換する
                            for (let idx = 0; idx < layers.length; ++idx) {

                                const layer = layers[idx];

                                const totalFrame = layer.totalFrame;
                                for (let frame = 1; totalFrame > frame; ) {

                                    const characters = layer.getActiveCharacter(frame);
                                    if (!characters.length || characters.length > 2) {
                                        frame++;
                                        continue;
                                    }

                                    const character = characters[0];
                                    const range = character.getRange(frame);

                                    // 幅が1フレーム以上なら次のレンジに移動
                                    if (range.endFrame - range.startFrame !== 1) {
                                        frame = range.endFrame;
                                        continue;
                                    }

                                    // キーフレームが終了していれば次のレイヤーへ
                                    if (frame + 1 >= totalFrame) {
                                        break;
                                    }

                                    if (!character.hasPlace(frame + 1)) {
                                        frame++;
                                        continue;
                                    }

                                    const startFrame = frame;
                                    for (;;) {

                                        // 次のフレームにキーフレームがなければ終了
                                        if (!character.hasPlace(frame + 1)) {
                                            if (frame - startFrame > 2) {
                                                character.setTween(startFrame, {
                                                    "method": "linear",
                                                    "curve": [],
                                                    "custom": Util.$tweenController.createEasingObject(),
                                                    "startFrame": startFrame,
                                                    "endFrame": frame
                                                });

                                                // キーフレームにtweenの設定を追加
                                                for (let tweenFrame = startFrame; frame > tweenFrame; ++tweenFrame) {
                                                    character.getPlace(tweenFrame).tweenFrame = startFrame;
                                                }
                                            }
                                            break;
                                        }

                                        frame++;

                                        // フレームが終了したら次のレイヤーに
                                        if (frame >= totalFrame) {
                                            break;
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
                                .$libraryController
                                .createInstance(InstanceType.BITMAP, `Bitmap_${id}`, id);

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
                                .$libraryController
                                .createInstance(InstanceType.BITMAP, `Bitmap_${id}`, id);

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
                                .$libraryController
                                .createInstance(InstanceType.SHAPE, `ShapeText_${id}`, id);

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
                                .$libraryController
                                .createInstance(InstanceType.BUTTON, `Button_${id}`, id);

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
                                .$libraryController
                                .createInstance(InstanceType.TEXT, `Text_${id}`, id);

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

                if (this._$libraryId) {

                    Util.$changeLibraryId = this._$libraryId;

                    workSpace
                        .scene
                        .changeFrame(
                            Util.$timelineFrame.currentFrame
                        );

                    Util.$changeLibraryId = 0;
                }
            }
            break;

        case "_$symbols":
            for (let idx = 0; idx < event.data.pieces.length; ++idx) {
                const piece = event.data.pieces[idx];
                Util.$symbols.set(piece.tagId, piece.ns);
            }
            return;

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

    // if (Util.$texts.size) {
    //
    //     const { Graphics } = window.next2d.display;
    //
    //     const workSpace = Util.$currentWorkSpace();
    //
    //     for (const character of Util.$texts.values()) {
    //
    //         const shape = workSpace.getLibrary(character.libraryId);
    //
    //         // build shape data
    //         let offsetX     = 0;
    //         let offsetY     = 0;
    //         let color       = null;
    //         let codeTables  = null;
    //         let shapeTables = null;
    //         let textHeight  = 0;
    //         let isZoneTable = false;
    //
    //         const baseMatrix = character._$baseMatrix;
    //
    //         // build shape data
    //         const records = character._$textRecords;
    //         for (let idx = 0; idx < records.length; ++idx) {
    //
    //             const record = records[idx];
    //
    //             if ("FontId" in record) {
    //                 const font  = Util.$fonts.get(record.FontId);
    //                 codeTables  = font._$codeTable;
    //                 shapeTables = font._$glyphShapeTable;
    //                 isZoneTable = font._$zoneTable !== null;
    //             }
    //
    //             if ("XOffset" in record) {
    //                 offsetX = record.XOffset;
    //             }
    //
    //             if ("YOffset" in record) {
    //                 offsetY = record.YOffset;
    //             }
    //
    //             if ("TextColor" in record) {
    //                 color = record.TextColor;
    //             }
    //
    //             if ("TextHeight" in record) {
    //                 textHeight = record.TextHeight;
    //                 if (isZoneTable) {
    //                     textHeight /= 20;
    //                 }
    //             }
    //
    //             const entries = record.GlyphEntries;
    //             const count   = record.GlyphCount;
    //             const scale   = textHeight / 1024;
    //             for (let idx = 0; idx < count; ++idx) {
    //
    //                 const entry = entries[idx];
    //                 const index = entry.GlyphIndex | 0;
    //
    //                 // add records
    //                 const shapeRecodes = Util.$vtc.convert({
    //                     "ShapeData": shapeTables[index],
    //                     "lineStyles": [],
    //                     "fillStyles": [{
    //                         "Color": color,
    //                         "fillStyleType": 0
    //                     }]
    //                 });
    //
    //                 const matrix = [
    //                     scale, baseMatrix[1], baseMatrix[2], scale,
    //                     baseMatrix[4] + offsetX,
    //                     baseMatrix[5] + offsetY
    //                 ];
    //
    //                 for (let idx = 0; idx < shapeRecodes.length;) {
    //
    //                     const code = shapeRecodes[idx++];
    //                     shape._$recodes.push(code);
    //                     switch (code) {
    //
    //                         case Graphics.MOVE_TO:
    //                         case Graphics.LINE_TO:
    //                             {
    //                                 const x  = shapeRecodes[idx++];
    //                                 const y  = shapeRecodes[idx++];
    //                                 const tx = x * matrix[0] + y * matrix[2] + matrix[4];
    //                                 const ty = x * matrix[1] + y * matrix[3] + matrix[5];
    //                                 shape._$recodes.push(tx, ty);
    //                             }
    //                             break;
    //
    //                         case Graphics.CURVE_TO:
    //                             {
    //                                 const cx  = shapeRecodes[idx++];
    //                                 const cy  = shapeRecodes[idx++];
    //                                 const ctx = cx * matrix[0] + cy * matrix[2] + matrix[4];
    //                                 const cty = cx * matrix[1] + cy * matrix[3] + matrix[5];
    //                                 shape._$recodes.push(ctx, cty);
    //
    //                                 const x  = shapeRecodes[idx++];
    //                                 const y  = shapeRecodes[idx++];
    //                                 const tx = x * matrix[0] + y * matrix[2] + matrix[4];
    //                                 const ty = x * matrix[1] + y * matrix[3] + matrix[5];
    //                                 shape._$recodes.push(tx, ty);
    //                             }
    //                             break;
    //
    //                         case Graphics.FILL_STYLE:
    //                             shape._$recodes.push(
    //                                 shapeRecodes[idx++], shapeRecodes[idx++],
    //                                 shapeRecodes[idx++], shapeRecodes[idx++]
    //                             );
    //                             break;
    //
    //                         case Graphics.BEGIN_PATH:
    //                         case Graphics.END_FILL:
    //                             break;
    //
    //                     }
    //                 }
    //
    //                 offsetX += entry.GlyphAdvance;
    //             }
    //         }
    //     }
    // }

    const workSpace = Util.$currentWorkSpace();
    for (const [id, name] of Util.$symbols) {
        const instance = workSpace.getLibrary(id);
        instance._$symbol = `${name}`;
    }

    // map clear
    Util.$characters.clear();
    Util.$symbols.clear();
    Util.$fonts.clear();
    Util.$texts.clear();

    Util.$libraryController.reload(
        Array.from(workSpace._$libraries.values())
    );

    // parser end
    worker.onmessage = null;

    if (this._$resolve) {
        this._$resolve();
    }

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
Util.$boundsMatrix = (bounds, matrix) =>
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
 * @returns {object}
 * @method
 * @static
 */
Util.$intToRGB = (color) =>
{
    return {
        "R": (color & 0xff0000) >> 16,
        "G": (color & 0x00ff00) >> 8,
        "B": color & 0x0000ff
    };
};

/**
 * @param  {object} object
 * @param  {Map}    dup
 * @method
 * @static
 */
Util.$copyContainer = (object, dup) =>
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
                if (object.type === InstanceType.MOVIE_CLIP) {

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
Util.$clearShapePointer = () =>
{
    const element  = document.getElementById("stage-area");
    if (!element) {
        return ;
    }

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
 * @return {object}
 * @static
 */
Util.$getDefaultLoopConfig = () =>
{
    return {
        "type": LoopController.DEFAULT,
        "start": 1,
        "end": 0
    };
};

/**
 * @param  {object} place
 * @param  {object} range
 * @param  {number} parent_frame
 * @param  {number} total_frame
 * @param  {number} static_frame
 * @return {number}
 * @static
 */
Util.$getFrame = (place, range, parent_frame, total_frame, static_frame = 0) =>
{
    const length = parent_frame - range.startFrame;

    let frame = 1;
    switch (place.loop.type) {

        case LoopController.REPEAT:
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

        case LoopController.NO_REPEAT:
            {
                const totalFrame = place.loop.end
                    ? place.loop.end
                    : total_frame;

                frame = place.loop.start;
                for (let idx = 0; idx < length; ++idx) {

                    ++frame;

                    // ループは一回だけなので最後のフレームで終了
                    if (frame > totalFrame) {
                        frame = totalFrame;
                        break;
                    }

                }
            }
            break;

        case LoopController.FIXED_ONE:
            frame = place.loop.start;
            break;

        case LoopController.NO_REPEAT_REVERSAL:
            frame = place.loop.end
                ? place.loop.end
                : total_frame;

            for (let idx = 0; idx < length; ++idx) {

                --frame;

                // ループは一回だけなので最初のフレームにセットして終了
                if (place.loop.start > frame) {
                    frame = place.loop.start;
                    break;
                }
            }
            break;

        case LoopController.REPEAT_REVERSAL:
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

        case LoopController.DEFAULT:

            if (static_frame === 0) {
                frame = 1;
                for (let idx = 0; idx < length; ++idx) {

                    ++frame;

                    if (frame > total_frame) {
                        frame = 1;
                    }

                }
            } else {
                frame = static_frame;
            }

            if (frame > total_frame) {
                frame = 1;
            }
            break;

    }

    return frame;
};
