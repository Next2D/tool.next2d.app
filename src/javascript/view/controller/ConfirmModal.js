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

        // confirm-file-name

        const elements = [
            "confirm-overwriting",
            "confirm-skip"
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

        let libraryId = 0;
        if (inputValue === this._$currentObject.file.name) {

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
    clear ()
    {
        this._$state = "hide";
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
        Util.$endMenu("confirm-modal");

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
            this._$state = "hide";
            Util.$endMenu();
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

        const input = document.getElementById("confirm-file-name");
        input.value = this._$currentObject.file.name;
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
