/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
 */
class JavaScriptEditor extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Editor}
         * @default null
         * @private
         */
        this._$editor = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$frame = -1;

        /**
         * @type {MovieClip}
         * @default null
         * @private
         */
        this._$scene = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$screenX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$screenY = 0;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseMove = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseUp = null;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get SCRIPT_MODAL_WIDTH ()
    {
        return 620;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get SCRIPT_MODAL_HEIGHT ()
    {
        return 450;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get SCRIPT_MODAL_BAR_HEIGHT ()
    {
        return 25;
    }

    /**
     * @description モーダルがアクティブかを返します。
     *
     * @return {boolean}
     * @readonly
     * @public
     */
    get active ()
    {
        return this._$active;
    }

    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        // JavaScriptの編集エディターを起動
        // this.createEditor();

        const elementIds = [
            "editor-hide-icon",
            "editor-bar"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // メニューを終了
                Util.$endMenu("editor-modal");

                // id名で関数を実行
                this.executeFunction(event);
            });
        }

        document
            .documentElement
            .style
            .setProperty("--script-modal-width", `${JavaScriptEditor.SCRIPT_MODAL_WIDTH}px`);

        document
            .documentElement
            .style
            .setProperty("--script-modal-height", `${JavaScriptEditor.SCRIPT_MODAL_HEIGHT}px`);

        document
            .documentElement
            .style
            .setProperty("--script-modal-bar-height", `${JavaScriptEditor.SCRIPT_MODAL_BAR_HEIGHT}px`);

    }

    /**
     * @description JavaScriptの編集エディターを起動
     *
     * @return {void}
     * @method
     * @public
     */
    createEditor ()
    {
        if (!("ace" in window)) {
            return ;
        }

        this._$editor = ace.edit("editor");
        this._$editor.setOptions({
            "enableBasicAutocompletion": true,
            "enableSnippets": true,
            "enableLiveAutocompletion": true
        });
        this._$editor.setTheme("ace/theme/monokai");
        this._$editor.session.setMode("ace/mode/javascript");

        const words = [
            { "word": "next2d", "meta": "window.next2d" },
            { "word": "toString",  "value": "toString()",  "meta": "common method" },
            { "word": "namespace", "meta": "common property" }
        ];

        const level1 = Object.keys(window.next2d);
        for (let idx = 1; idx < level1.length; ++idx) {

            const name = level1[idx];
            if (name.indexOf("_$") > -1) {
                continue;
            }

            if (!window.next2d[name]) {
                continue;
            }

            words.push({
                "word": `next2d.${name}`,
                "meta": `next2d.${name}`
            });

            const level2 = Object.keys(window.next2d[name]);
            for (let idx = 0; idx < level2.length; ++idx) {

                const className = level2[idx];
                words.push(
                    {
                        "word": className,
                        "meta": `next2d.${name}.${className}`
                    }
                );

                const Class = window.next2d[name][className];

                const staticMethods = Object.getOwnPropertyDescriptors(Class);
                const staticNames   = Object.getOwnPropertyNames(Class);
                for (let idx = 0; idx < staticNames.length; ++idx) {

                    const name = staticNames[idx];
                    switch (name) {

                        case "length":
                        case "prototype":
                        case "toString":
                        case "namespace":
                        case "name":
                            continue;

                        default:
                            break;

                    }

                    const object = staticMethods[name];
                    if ("value" in object) {

                        const args = object
                            .value
                            .toString()
                            .replace(/ |\n/g, "")
                            .split("{")[0]
                            .split("(")[1];

                        words.push({
                            "word": name,
                            "value": `${name}()`,
                            "meta": `${className}.${name}(${args}`
                        });

                    } else {

                        words.push({
                            "word": name,
                            "meta": `${className}.${name}`
                        });

                    }

                }

                const publicMethods = Object.getOwnPropertyDescriptors(Class.prototype);
                const publicNames   = Object.getOwnPropertyNames(Class.prototype);
                for (let idx = 0; idx < publicNames.length; ++idx) {

                    const name = publicNames[idx];
                    switch (name) {

                        case "constructor":
                        case "toString":
                        case "namespace":
                        case "name":
                            continue;

                        default:
                            break;

                    }

                    if (name.indexOf("_$") > -1) {
                        continue;
                    }

                    const object = publicMethods[name];
                    if ("value" in object) {

                        const args = object
                            .value
                            .toString()
                            .replace(/ |\n/g, "")
                            .split("{")[0]
                            .split("(")[1];

                        words.push({
                            "word": name,
                            "value": `${name}()`,
                            "meta": `${className}.${name}(${args}`
                        });

                    } else {

                        words.push({
                            "word": name,
                            "meta": `${className}.${name}`
                        });

                    }
                }
            }
        }

        ace
            .require("ace/ext/language_tools")
            .addCompleter({
                // eslint-disable-next-line no-unused-vars
                "getCompletions": (editor, session, pos, prefix, callback) =>
                {
                    callback(null, words.map((object) =>
                    {
                        return {
                            "caption": object.word,
                            "value":   object.value || object.word,
                            "meta":    object.meta,
                            "score":   0
                        };
                    }));
                }
            });

        //要素のリサイズイベント取得
        const resizeObserver = new ResizeObserver((entries) =>
        {
            entries.forEach((entry) =>
            {
                const element = entry.target;

                const modalWidth = parseFloat(document
                    .documentElement
                    .style
                    .getPropertyValue("--script-modal-width"));

                const modalHeight = parseFloat(document
                    .documentElement
                    .style
                    .getPropertyValue("--script-modal-height"));

                if (modalWidth !== element.clientWidth) {
                    document
                        .documentElement
                        .style
                        .setProperty("--script-modal-width", `${element.clientWidth}px`);
                }

                if (modalHeight !== element.clientHeight) {
                    document
                        .documentElement
                        .style
                        .setProperty("--script-modal-height",
                            `${element.clientHeight + JavaScriptEditor.SCRIPT_MODAL_BAR_HEIGHT}px`);
                }
            });

            this._$editor.resize();

        });

        const element = document.getElementById("editor-modal");
        if (element) {
            resizeObserver.observe(element);
        }
    }

    /**
     * @description JavaScriptの編集エディターを起動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelineScriptAdd (event)
    {
        this.show(event);
    }

    /**
     * @description JavaScriptの編集エディターを起動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuScriptAdd (event)
    {
        this.show(event);
    }

    /**
     * @description JavaScriptの編集エディターを起動
     *
     * @return {void}
     * @method
     * @public
     */
    executeEditorHideIcon ()
    {
        this.hide();
    }

    /**
     * @description JavaScriptの編集エディターを起動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeEditorBar (event)
    {
        // 現在の座標位置をセット
        this._$screenX = event.screenX;
        this._$screenY = event.screenY;

        if (!this._$mouseMove) {
            this._$mouseMove = this.mouseMove.bind(this);
        }

        if (!this._$mouseUp) {
            this._$mouseUp = this.mouseUp.bind(this);
        }

        // イベントを登録
        window.addEventListener("mousemove", this._$mouseMove);
        window.addEventListener("mouseup", this._$mouseUp);
    }

    /**
     * @description エディターを移動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        window.requestAnimationFrame(() =>
        {
            const element = document
                .getElementById("editor-modal");

            element.style.left = `${parseFloat(element.style.left) + (event.screenX - this._$screenX)}px`;
            element.style.top  = `${parseFloat(element.style.top)  + (event.screenY - this._$screenY)}px`;

            this._$screenX = event.screenX;
            this._$screenY = event.screenY;
        });
    }

    /**
     * @description マウスアップイベント。登録してるイベントを削除
     *
     * @return {void}
     * @method
     * @public
     */
    mouseUp ()
    {
        // イベントを削除
        window.removeEventListener("mousemove", this._$mouseMove);
        window.removeEventListener("mouseup", this._$mouseUp);
        Util.$setCursor("auto");
    }

    /**
     * @description JavaScriptの編集エディターを起動表示
     *
     * @param  {MouseEvent} [event=null]
     * @param  {number} [frame=0]
     * @param  {MovieClip} [scene=null]
     * @return {void}
     * @method
     * @public
     */
    show (event = null, frame = 0, scene = null)
    {
        Util.$keyLock = true;
        this._$active = true;

        // 追加対象のフレーム番号をセット
        this._$frame = frame || Util.$timelineFrame.currentFrame;

        // reset
        this._$editor.setValue("", -1);

        scene = scene || Util.$currentWorkSpace().scene;
        if (scene.hasAction(this._$frame)) {
            this._$editor.setValue(scene.getAction(this._$frame), -1);
        }

        document
            .getElementById("editor-title")
            .textContent = `${scene.name} / frame[${this._$frame}]`;

        const element = document.getElementById("editor-modal");
        if (event) {
            element.style.display = "";
            element.style.left = `${event.pageX + 5}px`;
            element.style.top  = `${event.pageY - element.clientHeight / 2}px`;
        }

        if (isNaN(parseFloat(element.style.left))) {
            element.style.left = "200px";
            element.style.top  = `${300 - element.clientHeight / 2}px`;
        }

        element.setAttribute("class", "fadeIn");
        Util.$endMenu("editor-modal");

        this._$editor.focus();
    }

    /**
     * @description JavaScriptの編集エディターの編集内容を保存して非表示
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        this.save();

        // 初期化
        this._$editor.setValue("", 0);
        this._$frame  = -1;
        this._$scene  = null;
        this._$active = false;
        Util.$keyLock = false;
        Util.$endMenu();
    }

    /**
     * @description 編集したjavaScriptの内容を保存
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        if (this._$frame === -1) {
            return ;
        }

        const leftFrame = Util.$timelineHeader.leftFrame;
        if (leftFrame > this._$frame) {
            return ;
        }

        const index  = this._$frame - leftFrame;
        const parent = document
            .getElementById("timeline-header")
            .children[index];

        const element = parent.children[TimelineHeader.ACTION_INDEX];
        const script  = this._$editor.getValue(0);

        const scene = this._$scene || Util.$currentWorkSpace().scene;
        if (script) {
            scene.setAction(this._$frame, script.trim());
            if (!this._$scene
                && !element.classList.contains("frame-border-box-action")
            ) {
                element.setAttribute("class", "frame-border-box-action");
            }
        } else {
            scene.deleteAction(this._$frame);
            if (!this._$scene) {
                element.setAttribute("class", "frame-border-box");
            }
        }
    }
}

Util.$javaScriptEditor = new JavaScriptEditor();
