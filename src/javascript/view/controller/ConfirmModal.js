/**
 * @class
 */
class ConfirmModal extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("");

        /**
         * @type {array}
         * @private
         */
        this._$files = [];

        /**
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$currentObject = null;

        /**
         * @type {Map}
         * @private
         */
        this._$mapping = new Map();

        /**
         * @type {Map}
         * @private
         */
        this._$layers = new Map();
    }

    /**
     * @return {array}
     * @public
     */
    get files ()
    {
        return this._$files;
    }

    /**
     * @param  {array} files
     * @return {void}
     * @public
     */
    set files (files)
    {
        this._$files = files;
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

        const elements = [
            "confirm-overwriting",
            "confirm-skip",
            "confirm-all-overwriting",
            "confirm-all-skip"
        ];

        for (let idx = 0; idx < elements.length; ++idx) {

            const element = document
                .getElementById(elements[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                event.stopPropagation();

                const names = event.target.id.split("-");

                let functionName = names
                    .map((value) =>
                    {
                        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
                    })
                    .join("");

                return this[`execute${functionName}`](event);
            });
        }
    }

    /**
     * @description 全て上書き
     *
     * @return {void}
     * @method
     * @public
     */
    executeConfirmAllOverwriting ()
    {
        this.save();

        const promises = [];

        this._$files.unshift(this._$currentObject);
        for (let idx = 0; idx < this._$files.length; ++idx) {

            const object = this._$files[idx];

            // 上書きするIDを指定
            const libraryId = Util
                .$currentWorkSpace()
                ._$nameMap
                .get(object.path);

            switch (object.type) {

                case "move":
                    this._$currentObject = object;
                    this.moveOverwriting(libraryId);
                    break;

                case "copy":
                    this._$currentObject = object;
                    this.copyOverwriting(libraryId);
                    break;

                default:
                    promises.push(Util
                        .$libraryController
                        .loadFile(
                            object.file,
                            object.folderId,
                            object.file.name,
                            libraryId
                        ));
                    break;

            }
        }

        // 値を初期化
        this._$currentObject = null;
        this._$files.length  = 0;

        // 再描画
        if (promises.length) {

            Promise
                .all(promises)
                .then(() =>
                {
                    // モーダルを非表示
                    this.hide();

                    //ライブラリを再構築
                    Util.$libraryController.reload();

                    // 再描画
                    this.reloadScreen();

                    this._$saved = false;
                });

        } else {

            this.setup();
            this._$saved = false;

        }

    }

    /**
     * @description 全ての上書きをスキップ
     *
     * @return {void}
     * @method
     * @public
     */
    executeConfirmAllSkip ()
    {
        this._$state         = "hide";
        this._$currentObject = null;
        this._$files.length  = 0;

        document
            .getElementById("confirm-modal")
            .setAttribute("class", "fadeOut");
    }

    /**
     * @description コピー＆ペースト時の上書き処理
     *
     * @param  {number} [libraryId = 0]
     * @param  {string} [value = ""]
     * @return {void}
     * @method
     * @public
     */
    copyOverwriting (libraryId = 0, value = "")
    {
        const workSpace = Util.$currentWorkSpace();

        // 名前を変えて上書き
        const instance = this._$currentObject.file;

        if (!this._$mapping.has(instance.id)) {
            this
                ._$mapping
                .set(instance.id, libraryId || workSpace.nextLibraryId);

            // 上書きなら元のElementを削除
            if (libraryId) {

                // Elementを削除
                const element = document
                    .getElementById(`library-child-id-${libraryId}`);

                if (element) {
                    element.remove();
                }

                // 移動元を配置しているDisplayObjectの情報を書き換え
                for (const library of workSpace._$libraries.values()) {

                    if (library.type !== InstanceType.MOVIE_CLIP) {
                        continue;
                    }

                    for (const layer of library._$layers.values()) {
                        for (let idx = 0; idx < layer._$characters.length; ++idx) {
                            layer._$characters[idx]._$image = null;
                        }
                    }
                }

                workSpace.removeLibrary(libraryId);
            }
        }

        const id = this._$mapping.get(instance.id);
        this.addLayer(id);

        // ライブラリに登録がなけれな登録
        if (!workSpace._$libraries.has(id)) {

            const clone = instance.clone();

            clone._$id = id;
            if (value) {
                clone._$name = value;
            }

            if (clone.folderId && this._$mapping.has(clone.folderId)) {
                clone.folderId = this._$mapping.get(clone.folderId);
            }

            workSpace._$libraries.set(clone.id, clone);

            // 登録
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

    /**
     * @description 登録されてるライブラリ移動時の重複アイテムの上書き処理
     *
     * @param  {number} libraryId
     * @return {void}
     * @method
     * @public
     */
    moveOverwriting (libraryId)
    {
        const workSpace = Util.$currentWorkSpace();
        const instance  = this._$currentObject.file;

        // Elementを削除
        const element = document
            .getElementById(`library-child-id-${libraryId}`);

        if (element) {
            element.remove();
        }

        // 移動元になっElementを削除
        document
            .getElementById(`library-child-id-${instance.id}`)
            .remove();

        workSpace.removeLibrary(instance.id);

        // 移動元を配置しているDisplayObjectの情報を書き換え
        for (const library of workSpace._$libraries.values()) {

            if (library.type !== InstanceType.MOVIE_CLIP) {
                continue;
            }

            for (const layer of library._$layers.values()) {
                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    const character = layer._$characters[idx];
                    if (character.libraryId !== instance.id) {
                        continue;
                    }

                    // 情報を更新してキャッシュをクリア
                    character.libraryId = libraryId;
                    character._$image   = null;
                }
            }
        }

        // フォルダーの場合は内部データも情報を更新する
        if (instance.type === InstanceType.FOLDER) {
            for (const library of workSpace._$libraries.values()) {
                if (library.folderId !== instance.id) {
                    continue;
                }
                library.folderId = libraryId;
            }
        }

        // Elementを追加
        instance._$id = libraryId;
        const library = workSpace.getLibrary(libraryId);
        instance.folderId = library.folderId;

        Util
            .$libraryController
            .createInstance(
                instance.type,
                instance.name,
                libraryId,
                instance.symbol
            );

        // 内部データに追加
        workSpace._$libraries.set(instance.id, instance);

        // 再描画前に、現在のシーンのキャッシュをクリア
        const scene = Util.$currentWorkSpace().scene;
        for (const layer of scene._$layers.values()) {
            for (let idx = 0; idx < layer._$characters.length; ++idx) {
                layer._$characters[idx]._$image = null;
            }
        }
    }

    /**
     * @description 上書きを実行
     *
     * @return {void}
     * @method
     * @public
     */
    executeConfirmOverwriting ()
    {
        this.save();

        const inputValue = document
            .getElementById("confirm-file-name")
            .value;

        let name = this._$currentObject.file.name;
        if (name.indexOf(".swf") > -1) {
            name = name.replace(".swf", "");
        }

        const workSpace = Util.$currentWorkSpace();

        let libraryId = 0;
        if (inputValue === name) {

            // 上書きならIDを指定
            libraryId = workSpace
                ._$nameMap
                .get(this._$currentObject.path);

        }

        // 移動による上書き
        switch (this._$currentObject.type) {

            case "move":
                if (libraryId) {

                    // 上書き
                    this.moveOverwriting(libraryId);

                } else {

                    // 名前を変えて上書き
                    const instance = this._$currentObject.file;

                    // 名前を変更
                    instance.name     = inputValue;
                    instance.folderId = this._$currentObject.folderId;

                    // 名前を変えたのがフォルダの場合は後続の処理を中止
                    if (instance.type === InstanceType.FOLDER) {
                        this._$files.length = 0;
                    }

                    // 一度削除
                    document
                        .getElementById(`library-child-id-${instance.id}`)
                        .remove();

                    // 再登録
                    Util
                        .$libraryController
                        .createInstance(
                            instance.type,
                            instance.name,
                            instance.id,
                            instance.symbol
                        );

                }

                this.setup();
                break;

            case "copy":
                this.copyOverwriting(libraryId, inputValue);
                this.setup();
                break;

            default:

                Util
                    .$libraryController
                    .loadFile(
                        this._$currentObject.file,
                        this._$currentObject.folderId,
                        inputValue,
                        libraryId
                    )
                    .then(() =>
                    {
                        this.setup();
                    });

                break;

        }

        this._$saved = false;
    }

    /**
     * @description レイヤーにDisplayObjectを追加
     *
     * @return {void}
     * @method
     * @public
     */
    addLayer (id)
    {
        // 複製
        const character = this._$currentObject.character;
        character.libraryId = id;

        const layer = this._$currentObject.layer;
        if (layer) {
            layer.addCharacter(character);

            if (!this._$layers.has(layer.id)) {
                this._$layers.set(layer.id, layer);
            }
        }
    }

    /**
     * @description スキップ
     *
     * @return {void}
     * @method
     * @public
     */
    executeConfirmSkip ()
    {
        this.setup();
    }

    /**
     * @description 設定を初期化
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        // 初期化
        this._$state = "hide";

        document
            .getElementById("confirm-modal")
            .setAttribute("class", "fadeOut");
    }

    /**
     * @description 上書き確認モーダルを表示
     *
     * @return {void}
     * @method
     * @public
     */
    show ()
    {
        if (this._$state === "show") {
            return ;
        }

        // 状態を更新
        this._$state = "show";

        // 全てのモーダルを非表示に
        Util.$endMenu();

        document
            .getElementById("confirm-modal")
            .setAttribute("class", "fadeIn");

        this.setup();
    }

    /**
     * @description プールしたオブジェクトから表示を更新
     *
     * @return {void}
     * @method
     * @public
     */
    setup ()
    {
        this._$currentObject = this._$files.shift();

        // 重複したDisplayObjectはここで処理を行う
        if (this._$currentObject && this._$mapping.size) {
            while (this._$mapping.has(this._$currentObject.file.id)) {

                const id = this._$mapping.get(this._$currentObject.file.id);
                this.addLayer(id);

                this._$currentObject = this._$files.shift();
                if (!this._$currentObject) {
                    break;
                }
            }
        }

        // 表示項目がなければモーダル表示を終了
        if (!this._$currentObject) {
            // 非表示
            this.hide();

            //ライブラリを再構築
            Util.$libraryController.reload();

            // マッピングを初期化
            this._$mapping.clear();

            // レイヤーを再描画
            if (this._$layers.size) {
                for (const layer of this._$layers.values()) {
                    layer.setCharacterStyle();
                }
            }
            this._$layers.clear();

            // 再描画
            this.reloadScreen();

            return ;
        }

        // 表示を初期化
        const beforeElement = document
            .getElementById("confirm-before-preview");

        while (beforeElement.firstChild) {
            beforeElement.firstChild.remove();
        }

        // 表示を初期化
        const afterElement = document
            .getElementById("confirm-after-preview");

        while (afterElement.firstChild) {
            afterElement.firstChild.remove();
        }

        const input = document
            .getElementById("confirm-file-name");

        let name = this._$currentObject.file.name;
        if (name.indexOf(".swf") > -1) {
            name = name.replace(".swf", "");
        }

        input.value = name;
        input.focus();

        const workSpace = Util.$currentWorkSpace();

        const instance = workSpace.getLibrary(
            workSpace._$nameMap.get(this._$currentObject.path)
        );

        if (instance) {
            beforeElement.appendChild(instance.getPreview());
        }

        const file = this._$currentObject.file;
        switch (file.type) {

            case "image/svg+xml":
            case "image/png":
            case "image/jpeg":
            case "image/gif":
                {
                    const image = new Image();
                    image.onload = () =>
                    {
                        afterElement.appendChild(image);
                    };

                    image.src = URL.createObjectURL(file);
                }
                break;

            case "video/mp4":
                {
                    const video = document.createElement("video");
                    video.crossOrigin = "anonymous";
                    video.type        = "video/mp4";
                    video.muted       = true;
                    video.autoplay    = false;
                    video.controls    = true;

                    video.onloadedmetadata = () =>
                    {
                        afterElement.appendChild(video);
                    };
                    video.src = URL.createObjectURL(file);
                    video.load();
                }
                break;

            case "audio/mpeg":
                {
                    const audio = document.createElement("audio");
                    audio.preload  = "auto";
                    audio.autoplay = false;
                    audio.loop     = false;
                    audio.controls = true;

                    audio.src = URL.createObjectURL(file);
                    audio.load();
                    afterElement.appendChild(audio);
                }
                break;

            default:

                afterElement
                    .appendChild(
                        this._$currentObject.file.getPreview()
                    );

                break;

        }
    }
}

Util.$confirmModal = new ConfirmModal();
