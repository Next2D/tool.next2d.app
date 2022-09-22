/**
 * タイムラインのレイヤーを管理するクラス
 * Class that manages layers in the timeline
 *
 * @class
 */
class Layer
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$id = 0;

        /**
         * @type {array}
         * @private
         */
        this._$characters = [];

        /**
         * @type {array}
         * @private
         */
        this._$emptys = [];

        /**
         * @type {Map}
         * @private
         */
        this._$instances = new Map();

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$maskId = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$guideId = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$light = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$disable = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$lock = false;

        /**
         * @type {number}
         * @default LayerMode.NORMAL
         * @private
         */
        this._$mode = LayerMode.NORMAL;

        /**
         * @type {string}
         * @default TimelineHighlight.color
         * @private
         */
        this._$color = TimelineHighlight.color;

        // 設定値があれば初期値を上書き
        if (object) {
            this._$name          = object.name;
            this._$light         = object.light;
            this._$disable       = object.disable;
            this._$lock          = object.lock;
            this._$mode          = object.mode;
            this._$maskId        = object.maskId;
            this._$guideId       = object.guideId;
            this._$color         = object.color || this._$color;
            this.characters      = object.characters;
            this.emptyCharacters = object.emptyCharacters || [];
        }
    }

    /**
     * @description シーン移動時の初期起動関数
     *              Initial startup function when moving scenes
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        // レイヤに必要なフレームをタイムラインに生成
        Util.$timelineLayer.create();

        const parent = document
            .getElementById("timeline-content");

        if (!parent) {
            return ;
        }

        const element = parent.lastElementChild;

        // set id
        this.id = element.dataset.layerId | 0;

        const name = document.getElementById(`layer-name-${this.id}`);
        if (this.name) {
            name.textContent = this.name;
            document
                .getElementById(`layer-name-input-${this.id}`)
                .value = this.name;
        } else {
            this.name = name.textContent;
        }

        const lightIcon = document
            .getElementById(`layer-light-icon-${this.id}`);

        lightIcon
            .style
            .backgroundImage = `url('${this.getHighlightURL()}')`;

        if (this.light) {

            lightIcon
                .classList
                .remove("icon-disable");

            lightIcon
                .classList
                .add("light-icon-active");

            element
                .style
                .borderBottom = `1px solid ${this.color}`;
        }

        if (this.disable) {

            const disableIcon = document
                .getElementById(`layer-disable-icon-${this.id}`);

            disableIcon
                .classList
                .remove("icon-disable");

            disableIcon
                .classList
                .add("icon-active");
        }

        if (this.lock) {

            const lockIcon = document
                .getElementById(`layer-lock-icon-${this.id}`);

            lockIcon
                .classList
                .remove("icon-disable");

            lockIcon
                .classList
                .add("icon-active");
        }

        // view
        this.showIcon();
        this.reloadStyle();
    }

    /**
     * @description ハイライトカラーをセットしたsvgのパスを返す
     *              Returns the path to the svg with highlight color set
     *
     * @return {string}
     * @method
     * @public
     */
    getHighlightURL ()
    {
        const object = Util.$intToRGB(
            `0x${this.color.slice(1)}` | 0
        );
        return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"><path fill="rgb(${object.R},${object.G},${object.B})" d="M14 19h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-4.5l1.188.782c.154.138.38.218.615.218h.895c.234 0 .461-.08.615-.218l1.187-.782zm3.75-13.799c0 3.569-3.214 5.983-3.214 8.799h-1.989c-.003-1.858.87-3.389 1.721-4.867.761-1.325 1.482-2.577 1.482-3.932 0-2.592-2.075-3.772-4.003-3.772-1.925 0-3.997 1.18-3.997 3.772 0 1.355.721 2.607 1.482 3.932.851 1.478 1.725 3.009 1.72 4.867h-1.988c0-2.816-3.214-5.23-3.214-8.799 0-3.723 2.998-5.772 5.997-5.772 3.001 0 6.003 2.051 6.003 5.772zm4-.691v1.372h-2.538c.02-.223.038-.448.038-.681 0-.237-.017-.464-.035-.69h2.535zm-10.648-6.553v-1.957h1.371v1.964c-.242-.022-.484-.035-.726-.035-.215 0-.43.01-.645.028zm-3.743 1.294l-1.04-1.94 1.208-.648 1.037 1.933c-.418.181-.822.401-1.205.655zm10.586 1.735l1.942-1.394.799 1.115-2.054 1.473c-.191-.43-.423-.827-.687-1.194zm-3.01-2.389l1.038-1.934 1.208.648-1.041 1.941c-.382-.254-.786-.473-1.205-.655zm-10.068 3.583l-2.054-1.472.799-1.115 1.942 1.393c-.264.366-.495.763-.687 1.194zm13.707 6.223l2.354.954-.514 1.271-2.425-.982c.21-.397.408-.812.585-1.243zm-13.108 1.155l-2.356 1.06-.562-1.251 2.34-1.052c.173.433.371.845.578 1.243zm-1.178-3.676h-2.538v-1.372h2.535c-.018.226-.035.454-.035.691 0 .233.018.458.038.681z"/></svg>`;
    }

    /**
     * @description レイヤーを複製
     *              Duplicate Layer
     *
     * @return {Layer}
     * @method
     * @public
     */
    clone ()
    {
        return new Layer(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @description 指定フレームに設置したDisplayObjectをスクリーンに配置
     *              DisplayObject placed in the specified frame on the screen
     *
     * @param  {number} [frame=1]
     * @return {void}
     * @method
     * @public
     */
    appendCharacter (frame = 1)
    {
        // 非表示のレイヤーはスキップ
        if (this.disable) {
            return ;
        }

        const element = document
            .getElementById("timeline-onion-skin");

        if (element.classList.contains("onion-skin-active")
            && Util.$timelinePlayer.stopFlag
        ) {

            const cacheFrame = Util.$timelineFrame.currentFrame;

            // レイヤーのキーフレームをセット
            const keyMap = new Map();
            for (let idx = 0; idx < this._$characters.length; ++idx) {

                const character = this._$characters[idx];

                for (let keyFrame of character._$places.keys()) {
                    keyMap.set(keyFrame, true);
                }

            }

            // 選択中のキーフレームは排除
            const activeCharacters = this.getActiveCharacter(cacheFrame);
            if (activeCharacters.length) {
                const range = activeCharacters[0].getRange(cacheFrame);
                keyMap.delete(range.startFrame);
            }

            for (const frame of keyMap.keys()) {

                Util.$timelineFrame.currentFrame = frame;

                const characters = this.getActiveCharacter(frame);
                if (!characters.length) {
                    continue;
                }

                if (characters.length > 1) {
                    this.sort(characters, frame);
                }

                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];
                    character._$image = null;

                    Util.$screen.appendOnionCharacter(character, this.id);
                }
            }

            Util.$timelineFrame.currentFrame = cacheFrame;

            const characters = this.getActiveCharacter(cacheFrame);
            if (characters.length) {

                if (characters.length > 1) {
                    this.sort(characters, cacheFrame);
                }

                const event = this.lock ? "none" : "auto";
                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];
                    character._$image = null;

                    Util.$screen.appendCharacter(
                        character, cacheFrame, this.id, event
                    );
                }

            }

        } else {

            const characters = this.getActiveCharacter(frame);
            if (characters.length) {

                if (characters.length > 1) {
                    this.sort(characters, frame);
                }

                const event = this.lock ? "none" : "auto";
                for (let idx = 0; idx < characters.length; ++idx) {
                    Util.$screen.appendCharacter(
                        characters[idx], frame, this.id, event
                    );
                }

            }
        }
    }

    /**
     * @description 深度順に並び替え(昇順)
     *              Sort by depth (ascending order)
     *
     * @param  {array}  characters
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    sort (characters, frame)
    {
        characters.sort((a, b) =>
        {
            const depthA = a.getPlace(frame).depth;
            const depthB = b.getPlace(frame).depth;
            switch (true) {

                case depthA > depthB:
                    return 1;

                case depthA < depthB:
                    return -1;

                default:
                    return 0;

            }
        });
    }

    /**
     * @description 指定フレームに配置されているDisplayObjectを配列で返す
     *              Returns an array of DisplayObjects placed in the specified frame.
     *
     * @param  {number} [frame=1]
     * @return {array}
     * @method
     * @public
     */
    getActiveCharacter (frame = 1)
    {
        const characters = [];
        for (let idx = 0; idx < this._$characters.length; ++idx) {

            const character = this._$characters[idx];

            if (character.startFrame > frame) {
                continue;
            }

            if (frame >= character.endFrame) {
                continue;
            }

            characters.push(character);
        }
        return characters;
    }

    /**
     * @description 指定したフレームに空のキャラクターオブジェクトがあれば返す
     *              Returns an empty character object if one exists in the specified frame.
     *
     * @param  {number} [frame=1]
     * @return {object}
     * @method
     * @public
     */
    getActiveEmptyCharacter (frame = 1)
    {
        for (let idx = 0; idx < this._$emptys.length; ++idx) {

            const character = this._$emptys[idx];

            if (character.startFrame > frame) {
                continue;
            }

            if (frame >= character.endFrame) {
                continue;
            }

            return character;
        }
        return null;
    }

    /**
     * @description レイヤーのモードによってアイコンを出し分ける
     *              Separate icons for each layer mode
     *
     * @return {void}
     * @method
     * @public
     */
    showIcon ()
    {

        // default
        const layerNameElement = document
            .getElementById(`layer-name-${this.id}`);

        layerNameElement
            .classList
            .remove("in-view-text");

        layerNameElement
            .classList
            .add("view-text");

        const inputElement = document
            .getElementById(`layer-name-input-${this.id}`);

        inputElement
            .classList
            .remove("in-view-text-input");

        switch (this._$mode) {

            case LayerMode.NORMAL:

                document
                    .getElementById(`layer-icon-${this.id}`)
                    .style.display = "";
                document
                    .getElementById(`layer-mask-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-mask-in-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-guide-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-guide-in-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`timeline-exit-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`timeline-exit-in-icon-${this.id}`)
                    .style.display = "none";

                break;

            case LayerMode.MASK:
                {
                    document
                        .getElementById(`layer-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-icon-${this.id}`)
                        .style.display = "";
                    document
                        .getElementById(`layer-mask-in-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-in-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`timeline-exit-in-icon-${this.id}`)
                        .style.display = "none";

                    const exitIcon = document
                        .getElementById(`timeline-exit-icon-${this.id}`);

                    exitIcon.style.display = "";
                    exitIcon.style.opacity = "0";
                }
                break;

            case LayerMode.MASK_IN:
                {
                    document
                        .getElementById(`layer-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-in-icon-${this.id}`)
                        .style.display = "";
                    document
                        .getElementById(`layer-guide-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-in-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`timeline-exit-icon-${this.id}`)
                        .style.display = "none";

                    const exitInIcon = document
                        .getElementById(`timeline-exit-in-icon-${this.id}`);

                    exitInIcon.style.display = "";
                    exitInIcon.style.opacity = "0";

                    const layerNameElement = document
                        .getElementById(`layer-name-${this.id}`);

                    layerNameElement
                        .classList
                        .remove("view-text");

                    layerNameElement
                        .classList
                        .add("in-view-text");

                    const inputElement = document
                        .getElementById(`layer-name-input-${this.id}`);

                    inputElement
                        .classList
                        .add("in-view-text-input");

                }
                break;

            case LayerMode.GUIDE:
                {
                    document
                        .getElementById(`layer-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-in-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-icon-${this.id}`)
                        .style.display = "";
                    document
                        .getElementById(`layer-guide-in-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`timeline-exit-in-icon-${this.id}`)
                        .style.display = "none";

                    const exitIcon = document
                        .getElementById(`timeline-exit-icon-${this.id}`);

                    exitIcon.style.display = "";
                    exitIcon.style.opacity = "0";
                }
                break;

            case LayerMode.GUIDE_IN:
                {
                    document
                        .getElementById(`layer-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-in-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-in-icon-${this.id}`)
                        .style.display = "";
                    document
                        .getElementById(`timeline-exit-icon-${this.id}`)
                        .style.display = "none";

                    const exitInIcon = document
                        .getElementById(`timeline-exit-in-icon-${this.id}`);

                    exitInIcon.style.display = "";
                    exitInIcon.style.opacity = "0";

                    const layerNameElement = document
                        .getElementById(`layer-name-${this.id}`);

                    layerNameElement
                        .classList
                        .remove("view-text");

                    layerNameElement
                        .classList
                        .add("in-view-text");

                    const inputElement = document
                        .getElementById(`layer-name-input-${this.id}`);

                    inputElement
                        .classList
                        .add("in-view-text-input");
                }
                break;

            default:
                break;

        }
    }

    /**
     * @description タイムラインのCSSを再配置する
     *              Rearranging the CSS in the Timeline
     *
     * @return {void}
     * @method
     * @public
     */
    reloadStyle ()
    {
        // 初期化
        this.resetStyle();

        // 空のフレーム
        this.setEmptyStyle();

        // DisplayObjectを配置したフレーム
        this.setCharacterStyle();
    }

    /**
     * @description DisplayObjectを配置したフレームのスタイルをセット
     *              Set the style of the frame in which the DisplayObject is placed
     *
     * @return {void}
     * @method
     * @public
     */
    setCharacterStyle ()
    {
        const layerId = this.id;
        const duplication = new Map();
        for (let idx = 0; idx < this._$characters.length; ++idx) {

            const character = this._$characters[idx];
            const places = Array.from(character._$places.keys());

            // 昇順
            places.sort((a, b) =>
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

            for (let idx = 0; idx < places.length; ++idx) {

                const startFrame = places[idx];
                if (duplication.has(startFrame)) {
                    continue;
                }

                // スタイル処理完了用のフラグ
                duplication.set(startFrame, true);

                const endFrame = places[idx + 1] || character.endFrame;
                if (startFrame === endFrame - 1) {

                    const element = document
                        .getElementById(`${layerId}-${startFrame}`);

                    element
                        .dataset
                        .frameState = "key-frame";

                    if (character.hasTween(startFrame)) {

                        element
                            .classList
                            .add("tween-key-frame");

                        const tweenObject = character.getTween(startFrame);
                        const rangeFrame  = tweenObject.endFrame - tweenObject.startFrame;

                        if (rangeFrame > 1 || character.hasTween(tweenObject.endFrame)) {
                            element
                                .classList
                                .add("tween-key-frame-join");
                        }

                    } else {

                        const place = character.getPlace(startFrame);
                        if (place.tweenFrame) {

                            const tweenObject = character
                                .getTween(place.tweenFrame);

                            if (tweenObject.endFrame - 1 === startFrame) {

                                if (character.hasTween(tweenObject.endFrame)) {

                                    element
                                        .classList
                                        .add("tween-space-frame");

                                } else {

                                    element
                                        .classList
                                        .add("tween-frame-end");

                                }

                            } else {

                                element
                                    .classList
                                    .add("tween-space-frame");

                            }

                        } else {

                            element
                                .classList
                                .add("key-frame");

                        }
                    }

                    continue;
                }

                // 複数フレームの場合のスタイル
                let frame = startFrame;

                // 開始フレーム
                const startElement = document
                    .getElementById(`${layerId}-${frame++}`);

                startElement
                    .dataset
                    .frameState = "key-frame";

                if (character.hasTween(startFrame)) {

                    startElement
                        .classList
                        .add(
                            "tween-key-frame",
                            "tween-key-frame-join"
                        );

                } else {

                    startElement
                        .classList
                        .add(
                            "key-frame",
                            "key-frame-join"
                        );

                }

                // 間のフレーム
                const spaceTotalFrame = endFrame - 1;
                for (; frame < spaceTotalFrame; ) {

                    const element = document
                        .getElementById(`${layerId}-${frame++}`);

                    element
                        .dataset
                        .frameState = "key-space-frame";

                    if (character.hasTween(startFrame)) {

                        element
                            .classList
                            .add("tween-space-frame");

                    } else {

                        element
                            .classList
                            .add("key-space-frame");

                    }

                }

                // 終了フレーム
                const endElement = document
                    .getElementById(`${layerId}-${frame++}`);

                endElement
                    .dataset
                    .frameState = "key-space-frame-end";

                if (character.hasTween(startFrame)) {

                    endElement
                        .classList
                        .add("tween-frame-end");

                } else {

                    endElement
                        .classList
                        .add("key-space-frame-end");

                }
            }
        }
    }

    /**
     * @description 空フレームのスタイルをセット
     *              Set empty frame style
     *
     * @return {void}
     * @method
     * @public
     */
    setEmptyStyle ()
    {
        const layerId = this.id;
        for (let idx = 0; idx < this._$emptys.length; ++idx) {

            const character = this._$emptys[idx];

            // 1フレームの場合
            if (character.startFrame === character.endFrame - 1) {

                const element = document
                    .getElementById(`${layerId}-${character.startFrame}`);

                element
                    .dataset
                    .frameState = "empty-key-frame";

                element
                    .classList
                    .add("empty-key-frame");

                continue;

            }

            // 複数フレームの場合のスタイル
            let frame = character.startFrame;

            // 開始フレーム
            const startElement = document
                .getElementById(`${layerId}-${frame++}`);

            startElement
                .dataset
                .frameState = "empty-key-frame";

            startElement
                .classList
                .add(
                    "empty-key-frame",
                    "empty-key-frame-join"
                );

            // 間のフレーム
            const endFrame =  character.endFrame - 1;
            for (; frame < endFrame; ) {

                const element = document
                    .getElementById(`${layerId}-${frame++}`);

                element
                    .dataset
                    .frameState = "empty-space-frame";

                element
                    .classList
                    .add("empty-space-frame");

            }

            // 終了フレーム
            const endElement = document
                .getElementById(`${layerId}-${frame++}`);

            endElement
                .dataset
                .frameState = "empty-space-frame-end";

            endElement
                .classList
                .add("empty-space-frame-end");

        }
    }

    /**
     * @description レイヤーのタイムラインのスタイルを初期化
     *              Initialize layer timeline style
     *
     * @return {void}
     * @method
     * @public
     */
    resetStyle ()
    {
        const layerId = this.id;

        let frame = 1;
        for (;;) {

            const element = document
                .getElementById(`${layerId}-${frame++}`);

            // Emptyフレームを見つけたら終了
            if (!element || element.dataset.frameState === "empty") {
                return ;
            }

            // 5の倍数のフレームにはポインター用のスタイルを追加する
            element.setAttribute("class", element.dataset.type === "frame-pointer"
                ? "frame frame-pointer"
                : "frame"
            );

            // 状態とクラスを初期化
            element.dataset.frameState = "empty";
        }
    }

    /**
     * @description レイヤーID、MovieClip内でユニークなID
     *              Layer ID, unique ID in MovieClip
     *
     * @default 0
     * @member {number}
     * @public
     */
    get id ()
    {
        return this._$id;
    }
    set id (id)
    {
        this._$id = Util.$clamp(id | 0, 0, 0xffff);
    }

    /**
     * @description レイヤー名
     *              Layer Name
     *
     * @default ""
     * @member {string}
     * @public
     */
    get name ()
    {
        return this._$name;
    }
    set name (name)
    {
        this._$name = `${name}`;
    }

    /**
     * @description ハイライトのon/off設定
     *              Highlight on/off setting
     *
     * @default false
     * @member {boolean}
     * @public
     */
    get light ()
    {
        return this._$light;
    }
    set light (light)
    {
        this._$light = !!light;
    }

    /**
     * @description 表示/非表示の設定
     *              Show/Hide settings
     *
     * @default false
     * @member {boolean}
     * @public
     */
    get disable ()
    {
        return this._$disable;
    }
    set disable (disable)
    {
        this._$disable = !!disable;
    }

    /**
     * @description レイヤーロックのon/off設定
     *              Layer lock on/off setting
     *
     * @default false
     * @member {boolean}
     * @public
     */
    get lock ()
    {
        return this._$lock;
    }
    set lock (lock)
    {
        this._$lock = !!lock;
    }

    /**
     * @description レイヤー内の空のキーフレーム配列
     *              Empty keyframe array in layer
     *
     * @member {array}
     * @public
     */
    get emptyCharacters ()
    {
        const characters = [];
        for (let idx = 0; idx < this._$emptys.length; ++idx) {
            characters.push(this._$emptys[idx].toObject());
        }
        return characters;
    }
    set emptyCharacters (characters)
    {
        for (let idx = 0; idx < characters.length; ++idx) {
            const character = new EmptyCharacter(characters[idx]);
            this._$emptys.push(character);
        }
    }

    /**
     * @description レイヤー内のDisplayObject配列
     *              DisplayObject array in layer
     *
     * @member {array}
     * @public
     */
    get characters ()
    {
        const characters = [];
        for (let idx = 0; idx < this._$characters.length; ++idx) {
            characters.push(this._$characters[idx].toObject());
        }
        return characters;
    }
    set characters (characters)
    {
        for (let idx = 0; idx < characters.length; ++idx) {

            const character = new Character(characters[idx]);
            character._$layerId = this.id;

            this._$instances.set(character.id, character);
            this._$characters.push(character);
        }
    }

    /**
     * @description 指定したIDのDisplayObjectを返す
     *              Returns the DisplayObject with the specified ID
     *
     * @param  {number} character_id
     * @return {Character}
     * @method
     * @public
     */
    getCharacter (character_id)
    {
        return this._$instances.get(character_id | 0);
    }

    /**
     * @description レイヤーにDisplayObjectを追加
     *              Add DisplayObject to layer
     *
     * @param  {Character} character
     * @return {void}
     * @method
     * @public
     */
    addCharacter (character)
    {
        character._$layerId = this.id;
        this._$characters.push(character);
        this._$instances.set(character.id, character);
    }

    /**
     * @description 指定したIDのDisplayObjectをレイヤーから削除
     *              Delete the DisplayObject with the specified ID from the layer
     *
     * @param  {number} character_id
     * @return {void}
     * @method
     * @public
     */
    deleteCharacter (character_id)
    {
        if (this._$instances.has(character_id | 0)) {

            const character = this._$instances.get(character_id | 0);
            character._$layerId = -1;

            this._$characters.splice(this._$characters.indexOf(character), 1);

            this._$instances.delete(character_id | 0);
        }
    }

    /**
     * @description 空のキーフレームを追加
     *              Add empty keyframes
     *
     * @param  {EmptyCharacter} character
     * @return {void}
     * @method
     * @public
     */
    addEmptyCharacter (character)
    {
        this._$emptys.push(character);
    }

    /**
     * @description 空のキーフレームを削除
     *              Delete empty keyframes
     *
     * @param  {EmptyCharacter} character
     * @return {void}
     * @method
     * @public
     */
    deleteEmptyCharacter (character)
    {
        const index = this._$emptys.indexOf(character);
        if (index > -1) {
            this._$emptys.splice(index, 1);
        }
    }

    /**
     * @description 現在のフレームを起点に追加できるフレームを調整して、追加できるフレームの幅を返す
     *              Adjusts the frames that can be added starting from the current frame and returns the width of the frames that can be added
     *
     * @param  {number} frame
     * @return {object}
     * @method
     * @public
     */
    adjustmentLocation (frame)
    {
        // 空のフレームがあれば削除して、範囲を返す
        const emptyCharacter = this.getActiveEmptyCharacter(frame);
        if (emptyCharacter) {

            this.deleteEmptyCharacter(emptyCharacter);

            return {
                "startFrame": emptyCharacter.startFrame,
                "endFrame": emptyCharacter.endFrame
            };
        }

        // 既存のDisplayObjectがあればキーフームから幅を算出
        const characters = this.getActiveCharacter(frame);
        if (characters.length) {

            let startFrame = 1;
            let endFrame   = Number.MAX_VALUE;
            for (let idx = 0; idx < characters.length; ++idx) {

                const character = characters[idx];

                startFrame = Math.max(startFrame, character.startFrame);
                endFrame   = Math.min(endFrame, character.endFrame);
                for (const keyFrame of character._$places.keys()) {

                    if (keyFrame > frame) {
                        endFrame = Math.min(endFrame, keyFrame);
                    }

                    if (frame >= keyFrame) {
                        startFrame = Math.max(startFrame, keyFrame);
                    }

                }
            }

            return {
                "startFrame": startFrame,
                "endFrame": endFrame
            };
        }

        // 前方のフレームの補完
        if (frame > 1) {

            let idx = 1;
            for (; frame - idx >= 0; ++idx) {

                // 空のフレームがあれば、フレームを伸ばす
                const emptyCharacter = this
                    .getActiveEmptyCharacter(frame - idx);

                if (emptyCharacter) {
                    emptyCharacter.endFrame = frame;
                    break;
                }

                // DisplayObjectがあれば、フレームを伸ばす
                const characters = this.getActiveCharacter(frame - idx);
                if (characters.length) {
                    for (let idx = 0; idx < characters.length; ++idx) {
                        characters[idx].endFrame = frame;
                    }
                    break;
                }
            }

            // 前方に何も配置されてない場合は空のキーフレームを登録
            if (!(frame - idx)) {
                this.addEmptyCharacter(new EmptyCharacter({
                    "startFrame": 1,
                    "endFrame": frame
                }));
            }
        }

        return {
            "startFrame": frame,
            "endFrame": frame + 1
        };
    }

    /**
     * @description レイヤーのアクティブなトータルフレーム数
     *              Number of active total frames in the layer
     *
     * @return {number}
     * @readonly
     * @public
     */
    get totalFrame ()
    {
        let frame = 0;
        for (let idx = 0; idx < this._$characters.length; ++idx) {

            const character = this._$characters[idx];
            frame = Math.max(frame, character.endFrame);

        }

        for (let idx = 0; idx < this._$emptys.length; ++idx) {

            const character = this._$emptys[idx];
            frame = Math.max(frame, character.endFrame);

        }

        return frame;
    }

    /**
     * @description レイヤーのモードの値
     *              Layer mode value
     *
     * @default 0
     * @member {number}
     * @public
     */
    get mode ()
    {
        return this._$mode;
    }
    set mode (mode)
    {
        mode = mode | 0;
        switch (mode) {

            case LayerMode.NORMAL:
            case LayerMode.MASK:
            case LayerMode.MASK_IN:
            case LayerMode.GUIDE:
            case LayerMode.GUIDE_IN:
                this._$mode = mode;
                break;

            default:
                this._$mode = LayerMode.NORMAL;
                break;

        }
    }

    /**
     * @description マスクレイヤーのID
     *              Mask Layer ID
     *
     * @default null
     * @member {number|null}
     * @public
     */
    get maskId ()
    {
        return this._$maskId;
    }
    set maskId (mask_id)
    {
        this._$maskId = typeof mask_id === "number"
            ? Util.$clamp(mask_id | 0, 0, 0xffff)
            : null;
    }

    /**
     * @description ガイドレイヤーのID
     *              Guide Layer ID
     *
     * @default null
     * @member {number|null}
     * @public
     */
    get guideId ()
    {
        return this._$guideId;
    }
    set guideId (guide_id)
    {
        this._$guideId = typeof guide_id === "number"
            ? Util.$clamp(guide_id | 0, 0, 0xffff)
            : null;
    }

    /**
     * @description ハイライトカラーの値
     *              Highlight Color Value
     *
     * @member {string}
     * @public
     */
    get color ()
    {
        return this._$color;
    }
    set color (color)
    {
        this._$color = `${color}`;
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject ()
    {
        return {
            "name":            this.name,
            "light":           this.light,
            "disable":         this.disable,
            "lock":            this.lock,
            "mode":            this.mode,
            "maskId":          this.maskId,
            "guideId":         this.guideId,
            "color":           this.color,
            "characters":      this.characters,
            "emptyCharacters": this.emptyCharacters
        };
    }
}
