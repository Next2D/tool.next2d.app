/**
 * @class
 * @memberOf view.controller
 */
class LibraryMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState !== "complete") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
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
        // イベントの登録を解除して、変数を解放
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        const element = document.getElementById("library-list-box");
        if (element) {

            element.addEventListener("contextmenu", (event) =>
            {
                this.show(event);
            });

            element.addEventListener("mousedown", (event) =>
            {
                if (event.button) {
                    return ;
                }

                this.hide();
            });

        }

        const elementIds = [
            "library-menu-container-add",
            "library-menu-folder-add",
            "library-menu-content-shape-clone",
            "library-menu-file",
            "library-menu-delete",
            "library-menu-no-use-delete"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                if (event.button) {
                    return ;
                }

                // 表示モーダルを全て終了
                Util.$endMenu();

                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                const names = event.target.id.split("-");

                let functionName = names
                    .map((value) =>
                    {
                        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
                    })
                    .join("");

                this[`execute${functionName}`](event);
            });

        }

        const fileInput = document
            .getElementById("library-menu-file-input");

        if (fileInput) {

            fileInput.addEventListener("change", (event) =>
            {
                this.save();

                const files = event.target.files;
                for (let idx = 0; idx < files.length; ++idx) {
                    Util.$libraryController.loadFile(files[idx]);
                }

                event.target.value = "";
                this._$saved = false;
            });
        }

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @description 新規のコンテナを生成
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuContainerAdd ()
    {
        this.save();

        const workSpace = Util.$currentWorkSpace();

        const id = workSpace.nextLibraryId;
        workSpace.addLibrary({
            "id": id,
            "type": InstanceType.MOVIE_CLIP,
            "name": `MovieClip_${id}`,
            "symbol": ""
        });

        this._$saved = false;

        // 再読み込み
        Util.$libraryController.reload();
    }

    /**
     * @description 新規のフォルダを生成
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuFolderAdd ()
    {
        this.save();

        const workSpace = Util.$currentWorkSpace();

        const id = workSpace.nextLibraryId;
        const folder = workSpace.addLibrary({
            "id": id,
            "type": "folder",
            "name": `Folder_${id}`,
            "symbol": ""
        });

        // 選択中のアイテムがあればフォルダーの中に格納
        const activeInstances = Util
            .$libraryController
            .activeInstances;

        if (activeInstances.size) {
            for (let libraryId of activeInstances.keys()) {

                const instance = workSpace.getLibrary(libraryId);

                instance.folderId = id;
            }

            folder.mode = FolderType.OPEN;
        }

        // 再読み込み
        Util.$libraryController.reload();

        this._$saved = false;
    }

    /**
     * @description 指定したShapeを複製する
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuContentShapeClone ()
    {
        const activeInstances = Util
            .$libraryController
            .activeInstances;

        if (!activeInstances.size) {
            return ;
        }

        let reload = false;
        const workSpace = Util.$currentWorkSpace();
        for (const libraryId of activeInstances.keys()) {

            const instance = workSpace.getLibrary(libraryId);
            if (instance.type !== InstanceType.SHAPE) {
                continue;
            }

            reload = true;
            this.save();

            const id = workSpace.nextLibraryId;
            const shape = workSpace.addLibrary(
                Util
                    .$libraryController
                    .createInstance(instance.type, `${instance.name}_Clone`, id)
            );

            instance.copyFrom(shape);
        }

        if (reload) {
            Util.$libraryController.reload();
        }

        this._$saved = false;
    }

    /**
     * @description 外部ファイルの読み込み処理
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuFile (event)
    {
        event.preventDefault();

        document
            .getElementById("library-menu-file-input")
            .click();
    }

    /**
     * @description 選択中のアイテムを削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuDelete ()
    {
        const activeInstances = Util
            .$libraryController
            .activeInstances;

        if (!activeInstances.size) {
            return ;
        }

        this.save();

        const workSpace = Util.$currentWorkSpace();
        for (const element of activeInstances.values()) {

            const libraryId = element.dataset.libraryId | 0;
            const instance = workSpace.getLibrary(libraryId);
            if (!instance) {
                continue;
            }

            // 削除関数を実行
            instance.remove();

            // elementを削除
            element.remove();

            // 内部データからも削除
            workSpace.removeLibrary(libraryId);
        }

        // 選択中のアイテムを解放
        activeInstances.clear();

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clearActiveElement();

        // スクリーンエリアの変形Elementを非表示に
        Util.$transformController.hide();
        Util.$gridController.hide();
        Util.$tweenController.clearPointer();

        // コントローラーエリアを初期化
        Util.$controller.default();

        // JavaScriptのリストを再読み込み
        Util.$javascriptController.reload();

        // ライブラリを再読み込み
        Util.$libraryController.reload();

        // プレビューを初期化
        Util.$libraryPreview.dispose();

        // 現在の配置での再計算
        Util.$timelineLayer.activeCharacter();

        // シーンを再読み込み
        workSpace.scene.changeFrame(
            Util.$timelineFrame.currentFrame
        );

        this._$saved = false;
    }

    /**
     * @description スクリーンに配置されていないアイテムを全て削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuNoUseDelete ()
    {
        let reload = false;
        const workSpace = Util.$currentWorkSpace();

        // 使用中のidを検索
        const useIds = new Map();
        for (let instance of workSpace._$libraries.values()) {

            if (instance.type !== InstanceType.MOVIE_CLIP) {
                continue;
            }

            for (let layer of instance._$layers.values()) {

                const characters = layer._$characters;
                for (let idx = 0; idx < characters.length; ++idx) {

                    const libraryId = characters[idx].libraryId;
                    if (useIds.has(libraryId)) {
                        continue;
                    }

                    useIds.set(libraryId, true);
                }
            }

            if (instance._$sounds.size) {
                for (const sounds of instance._$sounds.values()) {
                    for (let idx = 0; idx < sounds.length; ++idx) {

                        const sound = sounds[idx];
                        useIds.set(sound.characterId, true);

                    }
                }
            }
        }

        // 削除処理
        for (let instance of workSpace._$libraries.values()) {

            if (useIds.has(instance.id)
                || instance.type === InstanceType.FOLDER
                || instance.type === InstanceType.MOVIE_CLIP
            ) {
                continue;
            }

            this.save();
            reload = true;

            workSpace.removeLibrary(instance.id);
        }

        if (reload) {

            Util
                .$libraryController
                .clearActive();

            // JavaScriptのリストを再読み込み
            Util.$javascriptController.reload();

            // ライブラリを再読み込み
            Util.$libraryController.reload();
        }

        this._$saved = false;
    }

    /**
     * @description ライブラリのメニューを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    show (event)
    {
        const element = document
            .getElementById("library-menu");

        element.style.left = element.clientWidth + event.pageX + 5 > window.innerWidth
            ? `${event.pageX - (element.clientWidth + event.pageX + 10 - window.innerWidth)}px`
            : `${event.pageX + 5}px`;

        element.style.top = `${event.pageY - element.clientHeight / 2}px`;
        element.setAttribute("class", "fadeIn");

        Util.$endMenu("library-menu");
    }

    /**
     * @description モーダルを非表示
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        Util.$endMenu();
    }

    /**
     * @description undo用にデータを内部保管する
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        if (!this._$saved) {
            this._$saved = true;

            Util
                .$currentWorkSpace()
                .temporarilySaved();
        }
    }
}

Util.$libraryMenu = new LibraryMenu();
