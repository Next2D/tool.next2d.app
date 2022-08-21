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
        // 上書きするIDを指定
        const libraryId = Util
            .$currentWorkSpace()
            ._$nameMap
            .get(this._$currentObject.path);

        Util
            .$libraryController
            .loadFile(
                this._$currentObject.file,
                this._$currentObject.folderId,
                this._$currentObject.file.name,
                libraryId
            );

        for (let idx = 0; idx < this._$files.length; ++idx) {

            const object = this._$files[idx];

            // 上書きするIDを指定
            const libraryId = Util
                .$currentWorkSpace()
                ._$nameMap
                .get(object.path);

            Util
                .$libraryController
                .loadFile(
                    object.file,
                    object.folderId,
                    object.file.name,
                    libraryId
                );
        }

        this._$files.length  = 0;

        // モーダルを非表示
        this.hide();
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
     * @description 上書きを実行
     *
     * @return {void}
     * @method
     * @public
     */
    executeConfirmOverwriting ()
    {
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

        Util
            .$libraryController
            .loadFile(
                this._$currentObject.file,
                this._$currentObject.folderId,
                inputValue,
                libraryId
            );

        this.setup();
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
        this._$state         = "hide";
        this._$currentObject = null;

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
            this.hide();
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

        }
    }
}

Util.$confirmModal = new ConfirmModal();
