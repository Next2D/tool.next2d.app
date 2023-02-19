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
         * @type {number}
         * @default -1
         * @private
         */
        this._$copyWorkSpaceId = -1;

        /**
         * @type {*[]}
         * @private
         */
        this._$copyLibraries = [];

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$adjusted = false;

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
            "library-menu-file",
            "library-menu-delete",
            "library-menu-no-use-delete",
            "library-menu-empty-folder-delete",
            "library-menu-copy",
            "library-menu-paste",
            "library-open-photopea"
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
                if (Util.$saveProgress.active) {
                    return ;
                }

                Util.$saveProgress.start();

                this.save();

                Util.$saveProgress.loadFiles();

                const promises = [];
                const files = event.target.files;
                for (let idx = 0; idx < files.length; ++idx) {
                    // eslint-disable-next-line no-loop-func
                    promises.push(new Promise((resolve) =>
                    {
                        Util
                            .$libraryController
                            .loadFile(files[idx], resolve);
                    }));
                }

                Promise
                    .all(promises)
                    .then(() =>
                    {
                        Util.$saveProgress.end();
                    });

                event.target.value = "";
                this._$saved = false;
            });
        }

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @description 画像編集でPhotopeaを起動
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryOpenPhotopea ()
    {
        const activeInstances = Util
            .$libraryController
            .activeInstances;

        if (!activeInstances.size) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        for (let libraryId of activeInstances.keys()) {

            const instance = workSpace.getLibrary(libraryId);
            if (instance.type !== InstanceType.BITMAP) {
                continue;
            }

            instance
                .draw(
                    Util.$getCanvas(),
                    Math.ceil(instance.width),
                    Math.ceil(instance.height),
                    {
                        "frame": 1,
                        "matrix": [1, 0, 0, 1, 0, 0],
                        "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                        "blendMode": "normal",
                        "filter": []
                    },
                    null, 0, true
                )
                // eslint-disable-next-line no-loop-func
                .then((canvas) =>
                {
                    const object = {
                        "files" : [
                            canvas.toDataURL(instance.imageType)
                        ]
                    };

                    Util.$poolCanvas(canvas);

                    const a = document.createElement("a");
                    a.href = `https://www.photopea.com#${encodeURI(JSON.stringify(object))}`;
                    a.target = "_blank";
                    a.click();
                });
        }
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
     * @description 空のフォルダを全て削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuEmptyFolderDelete ()
    {
        const workSpace = Util.$currentWorkSpace();

        // 全てのフォルダを配列に格納
        const folders = [];
        for (let instance of workSpace._$libraries.values()) {
            if (instance.type !== InstanceType.FOLDER) {
                continue;
            }
            folders.push(instance);
        }

        if (folders.length) {

            let reload = false;
            for (;;) {

                const deleted = [];
                for (let idx = 0; idx < folders.length; ++idx) {

                    let use = false;
                    const folder = folders[idx];
                    for (let instance of workSpace._$libraries.values()) {

                        if (instance.folderId !== folder.id) {
                            continue;
                        }

                        use = true;
                        break;
                    }

                    if (use) {
                        continue;
                    }

                    reload = true;

                    // 利用していないフォルダを削除
                    document
                        .getElementById(`library-child-id-${folder.id}`)
                        .remove();

                    workSpace.removeLibrary(folder.id);

                    deleted.push(folder);
                }

                // 削除するものがなければ終了
                if (!deleted.length) {
                    break;
                }

                for (let idx = 0; idx < deleted.length; ++idx) {
                    const index = folders.indexOf(deleted[idx]);
                    folders.splice(index, 1);
                }

            }

            // ライブラリを再構成
            if (reload) {
                Util.$libraryController.reload();
            }
        }
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
                    if (!useIds.has(libraryId)) {
                        useIds.set(libraryId, 0);
                    }

                    const addCount = useIds.get(libraryId) + 1;
                    useIds.set(libraryId, addCount);

                    // 塗りの画像ID
                    const library = workSpace.getLibrary(libraryId);
                    if (library.type === "shape" && library.bitmapId) {
                        if (!useIds.has(library.bitmapId)) {
                            useIds.set(library.bitmapId, 0);
                        }

                        const addCount = useIds.get(libraryId) + 1;
                        useIds.set(libraryId, addCount);
                    }
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
        this.save();
        for (let instance of workSpace._$libraries.values()) {

            if (!instance.id) {
                continue;
            }

            if (useIds.has(instance.id)
                || instance.type === InstanceType.FOLDER
                || instance.symbol
            ) {
                continue;
            }

            reload = true;
            if (instance.type === InstanceType.MOVIE_CLIP) {

                for (let layer of instance._$layers.values()) {

                    const characters = layer._$characters;
                    for (let idx = 0; idx < characters.length; ++idx) {

                        const libraryId = characters[idx].libraryId;
                        if (!useIds.has(libraryId)) {
                            continue;
                        }

                        const instance = workSpace.getLibrary(libraryId);
                        if (!instance || instance.symbol) {
                            continue;
                        }

                        const count = useIds.get(libraryId) - 1;
                        useIds.set(libraryId, count);
                    }
                }
            }

            workSpace.removeLibrary(instance.id);
        }

        for (;;) {

            let idEnd = true;
            for (const [libraryId, currentCount] of useIds) {

                if (currentCount > 0) {
                    continue;
                }

                // 指定のアイテムを取得
                const instance = workSpace.getLibrary(libraryId);
                if (instance.symbol) {
                    continue;
                }

                idEnd = false;
                if (!instance) {
                    continue;
                }

                if (instance.type === InstanceType.MOVIE_CLIP) {

                    for (let layer of instance._$layers.values()) {

                        const characters = layer._$characters;
                        for (let idx = 0; idx < characters.length; ++idx) {

                            const libraryId = characters[idx].libraryId;
                            if (!useIds.has(libraryId)) {
                                continue;
                            }

                            const instance = workSpace.getLibrary(libraryId);
                            if (!instance || instance.symbol) {
                                continue;
                            }

                            const count = useIds.get(libraryId) - 1;
                            useIds.set(libraryId, count);
                        }
                    }
                }

                workSpace.removeLibrary(libraryId);
                useIds.delete(libraryId);
            }

            if (idEnd || !useIds.size) {
                break;
            }
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
     * @description コピー情報を初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clearCopy ()
    {
        this._$adjusted = false;
        this._$copyWorkSpaceId = -1;
        this._$copyLibraries.length = 0;
    }

    /**
     * @description 選択したアイテムをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuCopy ()
    {
        // 初期化
        this.clearCopy();

        // コピー元のワークスペースのIDをセット
        this._$copyWorkSpaceId = Util.$activeWorkSpaceId;

        const workSpace = Util.$currentWorkSpace();
        const activeInstances = Util.$libraryController.activeInstances;
        for (const element of activeInstances.values()) {

            const instance = workSpace.getLibrary(
                element.dataset.libraryId | 0
            );

            if (!instance) {
                continue;
            }

            this._$copyLibraries.push(instance.clone());
        }
    }

    /**
     * @description コピーしたアイテムを現在のプロジェクトに複製
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuPaste ()
    {
        if (!this._$copyLibraries.length) {
            return ;
        }

        const fromWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
        const toWorkSpace   = Util.$currentWorkSpace();

        // コピーしたアイテムがフォルダーの中にある場合
        // そのフォルダーがコピーに含まれているかチェック
        // コピーにフォルダーが含まれない場合は一階層上にコピーする
        if (!this._$adjusted) {

            this._$adjusted = true;

            // コピーしたアイテムがフォルダ内部にあるかチェック
            const idMap   = new Map();
            const inItems = [];
            for (let idx = 0; this._$copyLibraries.length > idx; ++idx) {

                const instance = this._$copyLibraries[idx];
                idMap.set(instance.id, true);

                if (!instance.folderId) {
                    continue;
                }

                inItems.push(instance);
            }

            // フォルダ内部にある場合、コピーデータにフォルダが含まれてるかチェック
            for (let idx = 0; idx < inItems.length; ++idx) {

                let instance = inItems[idx];
                while (instance.folderId) {

                    const folder = fromWorkSpace.getLibrary(instance.folderId);
                    if (idMap.has(folder.id)) {
                        // コピーの配列にフォルダが含まれていれば
                        // 全てコピーとなるので、単体のアイテムを配列から削除する
                        const index = this._$copyLibraries.indexOf(inItems[idx]);
                        if (index > -1) {
                            this._$copyLibraries.splice(index, 1);
                        }
                        break;
                    }

                    instance = folder;
                }

            }
        }

        // 状態保存
        this.save();
        for (let idx = 0; this._$copyLibraries.length > idx; ++idx) {

            const instance = this._$copyLibraries[idx];

            let clone = null;
            if (this._$copyWorkSpaceId === Util.$activeWorkSpaceId) {

                clone = instance.clone();

                // 名前が重複しなくなるまでprefixを追加する
                for (;;) {

                    const path = clone.path;

                    if (!toWorkSpace._$nameMap.has(path)) {
                        break;
                    }

                    clone.name += "_copy";
                }

            } else {

                // 別プロジェクトへのコピーなら確認モーダルを表示する
                const path = instance.getPathWithWorkSpace(fromWorkSpace);

                if (toWorkSpace._$nameMap.has(path)) {
                    Util.$confirmModal.files.push({
                        "file": instance,
                        "character": null,
                        "layer": null,
                        "path": path,
                        "workSpaceId": this._$copyWorkSpaceId,
                        "type": "copy"
                    });
                    continue;
                }

                if (instance.type === InstanceType.MOVIE_CLIP) {

                    clone = Util
                        .$confirmModal
                        .cloneMovieClip(this._$copyWorkSpaceId, instance);

                } else {

                    // プロジェクトを切り替えて複製
                    const activeWorkSpaceId = Util.$activeWorkSpaceId;
                    Util.$activeWorkSpaceId = this._$copyWorkSpaceId;

                    clone = instance.clone();
                    Util.$activeWorkSpaceId = activeWorkSpaceId;

                }

                if (!clone) {
                    continue;
                }

                // コピーするアイテムがフォルダ内にあれば階層を維持する
                if (clone.folderId) {

                    Util
                        .$confirmModal
                        .createFolder(this._$copyWorkSpaceId, clone);

                }

            }

            // IDを再発行
            clone._$id = toWorkSpace.nextLibraryId;

            // Elementを追加
            Util
                .$libraryController
                .createInstance(
                    clone.type,
                    clone.name,
                    clone.id,
                    clone.symbol
                );

            // 内部データに追加
            toWorkSpace._$libraries.set(clone.id, clone);

            // フォルダの中にあるアイテムを複製
            if (clone.type === InstanceType.FOLDER) {
                Util.$confirmModal.cloneFolderItem(
                    this._$copyWorkSpaceId, instance.id, clone
                );
            }
        }

        // ライブラリを再構成
        Util.$libraryController.reload();

        // 確認モーダルを表示
        if (Util.$confirmModal.files.length) {
            Util.$confirmModal.show();
        } else {
            Util.$confirmModal.clear();
        }

        // 初期化
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
