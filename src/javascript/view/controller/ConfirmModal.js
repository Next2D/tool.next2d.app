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

        this._$files.unshift(this._$currentObject);
        for (let idx = 0; idx < this._$files.length; ++idx) {

            const object = this._$files[idx];

            // 上書きするIDを指定
            const libraryId = Util
                .$currentWorkSpace()
                ._$nameMap
                .get(object.path);

            if (object.type === "move") {

                this._$currentObject = object;
                this.moveOverwriting(libraryId);

            } else {

                Util
                    .$libraryController
                    .loadFile(
                        object.file,
                        object.folderId,
                        object.file.name,
                        libraryId
                    );

            }
        }

        // モーダルを非表示
        this.hide();

        // 値を初期化
        this._$currentObject = null;
        this._$files.length  = 0;

        //ライブラリを再構築
        Util.$libraryController.reload();

        // 再描画
        this.reloadScreen();

        this._$saved = false;
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

        let libraryId = 0;
        if (inputValue === name) {

            // 上書きならIDを指定
            libraryId = Util
                .$currentWorkSpace()
                ._$nameMap
                .get(this._$currentObject.path);

        }

        // 移動による上書き
        if (this._$currentObject.type === "move") {

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

        } else {

            Util
                .$libraryController
                .loadFile(
                    this._$currentObject.file,
                    this._$currentObject.folderId,
                    inputValue,
                    libraryId
                );

        }

        this.setup();

        this._$saved = false;
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

        // 表示項目がなければモーダル表示を終了
        if (!this._$currentObject) {
            // 非表示
            this.hide();

            //ライブラリを再構築
            Util.$libraryController.reload();

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

        const libraryId = workSpace
            ._$nameMap.get(this._$currentObject.path);

        const instance = workSpace.getLibrary(libraryId);
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
                if (this._$currentObject.type === "move") {
                    const instance = this._$currentObject.file;
                    afterElement.appendChild(instance.getPreview());
                }
                break;

        }
    }
}

Util.$confirmModal = new ConfirmModal();
