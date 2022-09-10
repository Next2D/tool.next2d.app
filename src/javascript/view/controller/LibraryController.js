/**
 * @class
 */
class LibraryController
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
         * @type {Map}
         * @private
         */
        this._$activeInstances = new Map();

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState === "loading") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
    }

    /**
     * @return {Map}
     * @public
     */
    get activeInstances ()
    {
        return this._$activeInstances;
    }

    /**
     * @param  {HTMLDivElement} element
     * @return {void}
     * @public
     */
    set activeInstance (element)
    {
        switch (true) {

            case Util.$ctrlKey && this.activeInstances.size > 0:
                {
                    const libraryId = element.dataset.libraryId | 0;

                    // 選択中であれば非アクティブに
                    if (this.activeInstances.has(libraryId)) {

                        this.activeInstances.delete(libraryId);

                        element
                            .classList
                            .remove("active");

                    } else {

                        // アクティブ化
                        this.activeInstances.set(libraryId, element);

                        element
                            .classList
                            .add("active");

                    }
                }
                break;

            case Util.$shiftKey && this.activeInstances.size > 0:
                {
                    const children = Array.from(document
                        .getElementById("library-list-box")
                        .children);

                    const startIndex = children.indexOf(
                        this.activeInstances.values().next().value
                    );

                    const selectIndex = children.indexOf(element);
                    if (selectIndex === -1) {
                        return ;
                    }

                    // 初期化
                    this.clearActive();

                    // 同一のアイテムなら初期化して、選択したアイテムだけをアクティブにする
                    if (selectIndex === startIndex) {

                        this.activeInstances.set(
                            element.dataset.libraryId | 0, element
                        );

                        element
                            .classList
                            .add("active");

                        break;
                    }

                    if (selectIndex > startIndex) {

                        const length = selectIndex - startIndex + 1;
                        for (let idx = 0; length > idx; ++idx) {

                            const element = children[startIndex + idx];

                            this.activeInstances.set(
                                element.dataset.libraryId | 0, element
                            );

                            element
                                .classList
                                .add("active");
                        }

                    } else {

                        const length = startIndex - selectIndex + 1;
                        for (let idx = 0; length > idx; ++idx) {

                            const element = children[startIndex - idx];

                            this.activeInstances.set(
                                element.dataset.libraryId | 0, element
                            );

                            element
                                .classList
                                .add("active");
                        }

                    }

                }
                break;

            default:

                // 初期化
                this.clearActive();

                if (element) {
                    this.activeInstances.set(
                        element.dataset.libraryId | 0, element
                    );

                    element
                        .classList
                        .add("active");
                }
                break;

        }

    }

    /**
     * @description 選択中のアイテムを非アクティブ化
     *
     * @return {void}
     * @method
     * @public
     */
    clearActive ()
    {
        for (const element of this.activeInstances.values()) {
            element
                .classList
                .remove("active");
        }
        this.activeInstances.clear();

        // プレビューを初期化
        Util.$libraryPreview.dispose();
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

        const element = document
            .getElementById("library-list-box");

        if (element) {

            element.addEventListener("dragover", function (event)
            {
                event.preventDefault();
            });

            element.addEventListener("drop", (event) =>
            {
                this.drop(event);
            });

            element.addEventListener("dragstart", () =>
            {
                this.dragstart();
            });

            element.addEventListener("dragend", () =>
            {
                this.dragend();
            });

            element.addEventListener("mousedown", (event) =>
            {
                // 全てのイベントを中止
                event.stopPropagation();

                if (event.button) {
                    return ;
                }

                this.clearActive();
            });
        }

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @description サウンドのselectを初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clearSoundSelect ()
    {
        const element = document
            .getElementById("sound-select");

        while (element.children.length) {
            element.children[0].remove();
        }
    }

    /**
     * @description ライブラリのリストを初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clearLibrary ()
    {
        const element = document
            .getElementById("library-list-box");

        while (element.children.length) {
            element.children[0].remove();
        }

        // 上書き管理のマップも初期化
        Util
            .$currentWorkSpace()
            ._$nameMap
            .clear();

        Util.$confirmModal.hide();
    }

    /**
     * @description ライブラリの情報の再読み込み
     *
     * @param  {array} libraries
     * @return {void}
     * @method
     * @public
     */
    reload (libraries = null)
    {
        const workSpace = Util.$currentWorkSpace();

        // 指定がなければ現在のタブのライブラリを使用する
        if (!libraries) {
            libraries = Array.from(
                workSpace._$libraries.values()
            );
        }

        // ライブラリ一覧を初期化
        this.clearLibrary();

        // サウンド情報を初期化
        this.clearSoundSelect();

        // 名前順に並び替え
        libraries.sort((a, b) =>
        {
            const aString = a.name.toLowerCase();
            const bString = b.name.toLowerCase();
            switch (true) {

                case aString > bString:
                    return 1;

                case aString < bString:
                    return -1;

                default:
                    return 0;

            }
        });

        const folderMap   = new Map();
        const childrenMap = new Map();

        // ライブラリにセット
        for (let idx = 0; idx < libraries.length; ++idx) {

            const value = libraries[idx];

            if (!value.id) {
                continue;
            }

            Util
                .$libraryController
                .createInstance(
                    value.type, value.name, value.id, value.symbol
                );

            let path = value.name;
            if (value._$folderId) {
                let parent = workSpace.getLibrary(value._$folderId);
                path = `${parent.name}/${path}`;
                while (parent._$folderId) {
                    parent = workSpace.getLibrary(parent._$folderId);
                    path = `${parent.name}/${path}`;
                }
            }

            workSpace
                ._$nameMap
                .set(path, value.id);

            // fixed logic
            if (value.type === "folder" && value.mode === Util.FOLDER_OPEN) {

                this.openFolder(value);

            }

            if (value.folderId) {

                const element = document
                    .getElementById(`library-child-id-${value.id}`);

                element.remove();

                if (!childrenMap.has(value.folderId)) {
                    childrenMap.set(value.folderId, []);
                }

                childrenMap
                    .get(value.folderId)
                    .push(element);
            }

            if (value.type === "folder") {
                folderMap.set(value.id, value);
            }
        }

        if (folderMap.size) {

            const parent = document
                .getElementById("library-list-box");

            const dup = new Map();
            while (folderMap.size !== dup.size) {

                for (const [folderId, folder] of folderMap) {

                    // 空のフォルダはスキップ
                    if (!childrenMap.has(folderId)) {
                        dup.set(folderId, true);
                        continue;
                    }

                    // 処理済みであればスキップ
                    if (dup.has(folderId)) {
                        continue;
                    }

                    const element = document
                        .getElementById(`library-child-id-${folder.id}`);

                    // 順番的にまだelementがない時は後続のタスクにする
                    if (!element) {
                        continue;
                    }

                    const children = childrenMap.get(folderId);
                    for (let idx = children.length - 1; idx > -1; --idx) {

                        const child = children[idx];

                        parent.insertBefore(
                            child, element.nextElementSibling
                        );

                        if (folder.mode === Util.FOLDER_CLOSE) {
                            child.style.display = "none";
                        }

                    }

                    // 終了管理
                    dup.set(folderId, true);
                }

                // 一番上位のフォルダから処理を実行
                for (const [folderId, folder] of folderMap) {

                    // 空のフォルダか、子孫のフォルダならスキップ
                    if (!childrenMap.has(folderId) || folder.folderId) {
                        continue;
                    }

                    this.updateFolderStyle(folder, folder.mode);
                }

            }

            dup.clear();
            folderMap.clear();
            childrenMap.clear();
        }

        // 重複登録防止のnameMapを生成
    }

    /**
     * @description ライブラリにコンテンツを生成
     *
     * @param  {string} type
     * @param  {string} name
     * @param  {uint}   id
     * @param  {string} [symbol=""]
     * @return {object}
     * @method
     * @public
     */
    createInstance (type, name, id, symbol = "")
    {
        const htmlTag = `
<div draggable="true" class="library-list-box-child" id="library-child-id-${id}" data-library-id="${id}">
    <div class="library-list-box-name">
        <i class="library-type-${type === InstanceType.FOLDER ? "arrow close" : "space"}" id="arrow-${id}" data-library-id="${id}"></i>
        <i class="library-type-${type} " id="${type}-${id}" data-library-id="${id}"></i>
        <p>
            <span id="library-name-${id}" class="view-text" data-type="name" data-library-id="${id}">${name}</span>
            <input type="text" id="library-name-input-${id}" data-library-id="${id}" data-type="name" value="${name}" style="display: none;">
        </p>
    </div>
    <div class="library-list-box-symbol">
        <p>
            <span id="library-symbol-name-${id}" class="view-symbol-text" data-type="symbol" data-library-id="${id}">${symbol}</span>
            <input type="text" id="library-symbol-name-input-${id}" data-library-id="${id}" data-type="symbol" value="${symbol}" style="display: none;">
        </p>
    </div>
</div>`;

        const element = document
            .getElementById("library-list-box");

        element.insertAdjacentHTML("beforeend", htmlTag);

        if (type === "container") {
            document
                .getElementById(`${type}-${id}`)
                .addEventListener("dblclick", (event) =>
                {
                    Util.$sceneChange.reload(
                        event.currentTarget.dataset.libraryId | 0
                    );
                });
        }

        const child = document
            .getElementById(`library-child-id-${id}`);

        // 選択中のアイテムであれば上書きしてアクティブ化
        if (this.activeInstances.has(id)) {

            this.activeInstances.set(id, child);

            child
                .classList
                .add("active");
        }

        // elementの選択処理
        child.addEventListener("mousedown", (event) =>
        {
            this.selectInstance(event);
        });

        if (type === "folder") {

            child.addEventListener("dragover", (event) =>
            {
                event.preventDefault();
            });

            child.addEventListener("drop", (event) =>
            {
                this.folderIn(event);
            });

            const arrowElement = document.getElementById(`arrow-${id}`);
            arrowElement.addEventListener("mousedown", (event) =>
            {
                this.clickFolder(event);
            });

            const iconElement = document.getElementById(`${type}-${id}`);
            iconElement.addEventListener("dblclick", (event) =>
            {
                this.clickFolder(event);
            });

            iconElement
                .classList
                .remove("library-type-folder");

            iconElement
                .classList
                .add("library-type-folder-close");

        }

        if (type === "sound") {

            const option = document.createElement("option");
            option.value     = `${id}`;
            option.innerHTML = name;

            document
                .getElementById("sound-select")
                .appendChild(option);

        }

        const viewElements = [
            `library-name-${id}`
        ];

        if (type !== "folder") {
            viewElements.push(`library-symbol-name-${id}`);
        }

        for (let idx = 0; idx < viewElements.length; ++idx) {

            document
                .getElementById(viewElements[idx])
                .addEventListener("dblclick", (event) =>
                {
                    this.inputStart(event);
                });

        }

        const inputElements = [
            `library-name-input-${id}`
        ];

        if (type !== "folder") {
            inputElements.push(`library-symbol-name-input-${id}`);
        }

        for (let idx = 0; idx < inputElements.length; ++idx) {

            const input = document
                .getElementById(inputElements[idx]);

            input.addEventListener("focusout", (event) =>
            {
                this.inputEnd(event);
            });

            input.addEventListener("keypress", (event) =>
            {
                this.inputEnd(event);
            });

        }

        return {
            "id": id,
            "type": type,
            "name": name,
            "symbol": symbol
        };
    }

    /**
     * @description ライブラリアイテムの選択処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    selectInstance (event)
    {
        if (event.button || Util.$keyLock) {
            return ;
        }

        // モーダルを非表示に
        Util.$endMenu();

        // 全てのイベントw中止
        event.stopPropagation();

        const target = event.currentTarget;

        if (!Util.$ctrlKey && !Util.$shiftKey
            && target.classList.contains("active")
        ) {
            return ;
        }

        this.activeInstance = target;

        // プレビューに表示
        Util
            .$libraryPreview
            .loadImage(
                target.dataset.libraryId | 0
            );
    }

    /**
     * @description inputタグを有効にする、移動を無効化
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    inputStart (event)
    {
        // キーロック
        Util.$keyLock = true;

        // 全てのイベントを中止
        event.stopPropagation();

        const target = event.target;
        const libraryId = target.dataset.libraryId | 0;

        const parent = document
            .getElementById(`library-child-id-${libraryId}`);

        parent
            .classList
            .remove("active");

        parent.draggable = false;

        const inputId = target.dataset.type === "name"
            ? `library-name-input-${libraryId}`
            : `library-symbol-name-input-${libraryId}`;

        const input = document.getElementById(inputId);
        input.value = target.textContent;
        input.style.display = "";
        input.focus();

        target.style.display = "none";
    }

    /**
     * @description inputタグを無効にする
     *
     * @param  {Event|KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    inputEnd (event)
    {
        if (event.key === "Enter") {
            event.target.blur();
            return ;
        }

        if (event.type === "focusout") {

            this.save();

            const target    = event.target;
            const libraryId = target.dataset.libraryId | 0;

            const library = Util
                .$currentWorkSpace()
                .getLibrary(libraryId);

            const viewId = target.dataset.type === "name"
                ? `library-name-${libraryId}`
                : `library-symbol-name-${libraryId}`;

            const element = document
                .getElementById(viewId);

            // データを更新
            library[target.dataset.type] = target.value;
            element.textContent   = target.value;
            element.style.display = "";

            const parent = document
                .getElementById(`library-child-id-${libraryId}`);

            if (this.activeInstances.has(libraryId)) {
                parent
                    .classList
                    .add("active");
            }

            target.style.display = "none";
            parent.draggable     = true;
            Util.$keyLock        = false;
            this._$saved         = false;

            if (target.dataset.type === "name") {
                this.reload();
            }
        }
    }

    /**
     * @description フォルダーアイコンをダブルクリックした処理
     *
     * @return {void}
     * @method
     * @public
     */
    clickFolder (event)
    {
        // 全てのイベント中止
        event.stopPropagation();

        const folder = Util
            .$currentWorkSpace()
            .getLibrary(
                event.target.dataset.libraryId | 0
            );

        if (folder.mode === Util.FOLDER_OPEN) {

            // 閉じる処理
            this.closeFolder(folder);

        } else {

            // 開く処理
            this.openFolder(folder);

        }

        this.updateFolderStyle(folder, folder.mode);
    }

    /**
     * @description フォルダーの内部にelementのスタイルを変更する
     *
     * @param  {Folder} folder
     * @param  {string} mode
     * @return {void}
     * @public
     */
    updateFolderStyle (folder, mode)
    {
        const workSpace = Util.$currentWorkSpace();

        const children = document
            .getElementById("library-list-box")
            .children;

        let depth = 20;
        let instanceId = folder.folderId;
        if (instanceId) {
            for (;;) {

                const instance = workSpace.getLibrary(instanceId);
                if (!instance) {
                    break;
                }

                depth += 20;

                instanceId = instance.folderId;
                if (!instanceId) {
                    break;
                }

            }
        }

        for (let idx = 0; idx < children.length; ++idx) {

            const node = children[idx];

            const instance = workSpace
                .getLibrary(node.dataset.libraryId | 0);

            if (!instance.folderId) {
                continue;
            }

            if (instance.folderId !== folder.id) {
                continue;
            }

            node.style.paddingLeft = `${depth}px`;
            node.style.display = mode === Util.FOLDER_OPEN
                ? ""
                : "none";

            if (instance.type === InstanceType.FOLDER) {
                this.updateFolderStyle(
                    instance,
                    mode === Util.FOLDER_OPEN ? instance.mode : mode
                );
            }
        }
    }

    /**
     * @description フォルダーを開く
     *
     * @param  {Folder} folder
     * @return {void}
     * @method
     * @public
     */
    openFolder (folder)
    {
        folder.mode = Util.FOLDER_OPEN;

        const iconElement = document
            .getElementById(`folder-${folder.id}`);

        iconElement
            .classList
            .remove("library-type-folder-close");

        iconElement
            .classList
            .add("library-type-folder-open");

        const arrowElement = document
            .getElementById(`arrow-${folder.id}`);

        arrowElement
            .classList
            .add("open");

        arrowElement
            .classList
            .remove("close");
    }

    /**
     * @description フォルダーを閉じる
     *
     * @param  {Folder} folder
     * @return {void}
     * @method
     * @public
     */
    closeFolder (folder)
    {
        folder.mode = Util.FOLDER_CLOSE;

        const iconElement = document
            .getElementById(`folder-${folder.id}`);

        iconElement
            .classList
            .remove("library-type-folder-open");

        iconElement
            .classList
            .add("library-type-folder-close");

        const arrowElement = document
            .getElementById(`arrow-${folder.id}`);

        arrowElement
            .classList
            .remove("open");

        arrowElement
            .classList
            .add("close");
    }

    /**
     * @description ドラッグ時はスクリーンのイベントを無効にする
     *
     * @return {void}
     * @method
     * @public
     */
    dragstart ()
    {
        const children = document
            .getElementById("stage-area")
            .children;

        for (let idx = 1; idx < children.length; ++idx) {
            children[idx].style.pointerEvents = "none";
        }
    }

    /**
     * @description ドラッグ終了時はスクリーンのイベントを有効にする
     *
     * @return {void}
     * @method
     * @public
     */
    dragend ()
    {
        const children = document
            .getElementById("stage-area")
            .children;

        for (let idx = 1; idx < children.length; ++idx) {

            const node = children[idx];
            if (node.dataset.preview) {
                continue;
            }

            node.style.pointerEvents = "";
        }
    }

    /**
     * @description ライブラリエリアにコンテンツのドロップ処理
     *
     * @param  {DragEvent} event
     * @return {void}
     * @method
     * @public
     */
    drop (event)
    {
        event.preventDefault();
        event.stopPropagation();

        this.save();

        const items = event.dataTransfer.items;
        console.log(items);
        if (items.length) {

            // 選択中のコンテンツを非アクティブに
            this.clearActive();

            const items = event.dataTransfer.items;
            for (let idx = 0; idx < items.length; ++idx) {
                this.scanFiles(
                    items[idx].webkitGetAsEntry()
                );
            }

        } else {

            // フォルダーの外に移動
            this.folderOut();

            // 再読み込み
            this.reload();
        }

        this._$saved = false;
    }

    /**
     * @description 読み込んだファイルのチェック
     *
     * @param  {FileSystemDirectoryEntry} entry
     * @param  {number} [folder_id=0]
     * @return {void}
     * @method
     * @public
     */
    scanFiles (entry, folder_id = 0)
    {
        switch (true) {

            case entry.isDirectory:
                {
                    const instance = Util
                        .$currentWorkSpace()
                        .addLibrary({
                            "id": Util.$currentWorkSpace().nextLibraryId,
                            "type": "folder",
                            "name": entry.name,
                            "symbol": ""
                        });

                    if (folder_id) {
                        instance.folderId = folder_id;
                    }

                    entry
                        .createReader()
                        .readEntries((entries) =>
                        {
                            for (let idx = 0; idx < entries.length; ++idx) {
                                this.scanFiles(entries[idx], instance.id);
                            }
                        });

                    this.updateFolderStyle(instance, instance.mode);
                }
                break;

            case entry.isFile:
                entry.file((file) =>
                {
                    this.loadFile(file, folder_id);
                });
                break;

        }
    }

    /**
     * @description 関連するコンテンツを表示と内部データから削除
     *
     * @param  {number} library_id
     * @return {void}
     * @method
     * @public
     */
    removeLibrary (library_id)
    {
        const element = document
            .getElementById(`library-child-id-${library_id}`);

        if (element) {
            element.remove();
        }

        const workSpace = Util.$currentWorkSpace();

        const instance = workSpace.getLibrary(library_id);
        if (!instance) {
            return ;
        }

        // SWFとSVGの場合はコンテナを基準に削除処理を行う
        if (instance.type === InstanceType.MOVIE_CLIP) {

            const libraryIds = new Map();
            for (const layer of instance._$layers.values()) {

                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    const character = layer._$characters[idx];

                    if (!libraryIds.has(character.libraryId)) {
                        libraryIds.set(character.libraryId, true);
                    }

                    const instance = workSpace
                        .getLibrary(character.libraryId);

                    if (instance && instance.type === InstanceType.MOVIE_CLIP) {
                        this.removeLibrary(character.libraryId);
                    }
                }
            }

            if (libraryIds.size) {

                // 削除対象でないMovieClipで利用されていれば削除
                for (const libraryId of libraryIds.keys()) {

                    const instance = workSpace.getLibrary(libraryId);
                    if (!instance) {
                        continue;
                    }

                    const element = document
                        .getElementById(`library-child-id-${libraryId}`);

                    if (element) {
                        element.remove();
                    }

                    instance.remove();

                    workSpace.removeLibrary(libraryId);
                }
            }
        }

        workSpace.removeLibrary(library_id);
    }

    /**
     * @description 読み込み処理
     *
     * @param  {File} file
     * @param  {number} [folder_id=0]
     * @param  {string} [name=""]
     * @param  {number} [library_id=0]
     * @return {void}
     * @method
     * @public
     */
    loadFile (file, folder_id = 0, name = "", library_id = 0)
    {
        console.log(file, folder_id);

        const workSpace = Util.$currentWorkSpace();

        let path = name || file.name;

        // swfの場合は拡張子を削除
        if (path.indexOf(".swf") > -1) {
            path = path.replace(".swf", "");
        }

        if (folder_id) {
            let parent = workSpace.getLibrary(folder_id);
            path = `${parent.name}/${path}`;
            while (parent._$folderId) {
                parent = workSpace.getLibrary(parent._$folderId);
                path = `${parent.name}/${path}`;
            }
        }

        // 上書き確認
        if (!library_id && workSpace._$nameMap.has(path)) {

            Util.$confirmModal.files.push({
                "file": file,
                "folderId": folder_id,
                "path": path
            });

            Util.$confirmModal.show();

            return ;
        }

        // 上書きの場合はElementと内部データを削除
        if (library_id) {
            this.removeLibrary(library_id);
        }

        switch (file.type) {

            case "image/svg+xml":
                file
                    .text()
                    .then((value) =>
                    {
                        const object = this.createInstance(
                            InstanceType.MOVIE_CLIP,
                            name || file.name,
                            library_id || workSpace.nextLibraryId
                        );

                        const movieClip = workSpace.addLibrary(object);

                        workSpace
                            ._$nameMap
                            .set(path, object.id);

                        // ドロップしたアイテムをアクティブ化
                        const element = document
                            .getElementById(`library-child-id-${object.id}`);

                        if (element) {
                            this.activeInstances.set(object.id, element);

                            element
                                .classList
                                .add("active");
                        }

                        if (folder_id) {
                            movieClip.folderId = folder_id;

                            const folder = workSpace.getLibrary(folder_id);

                            this.updateFolderStyle(folder, folder.mode);
                        }

                        SVGToShape.parse(value, movieClip);

                        // ライブラリ選択のselectを更新
                        Util
                            .$instanceSelectController
                            .createInstanceSelect(movieClip);

                        // ライブラリ一覧を再構成
                        Util.$libraryController.reload();

                        // プレビューを表示
                        Util.$libraryPreview.loadImage(movieClip.id);

                        // 上書きならスクリーンを再描画
                        if (library_id) {
                            this.reloadScreen(library_id);
                        }
                    });
                break;

            case "image/png":
            case "image/jpeg":
            case "image/gif":
                file
                    .arrayBuffer()
                    .then((buffer) =>
                    {

                        const blob = new Blob([buffer], {
                            "type": file.type
                        });

                        const image = new Image();
                        image.src = URL.createObjectURL(blob);
                        image
                            .decode()
                            .then(() =>
                            {
                                const width   = image.width;
                                const height  = image.height;

                                const canvas  = document.createElement("canvas");
                                canvas.width  = width;
                                canvas.height = height;
                                const context = canvas.getContext("2d");

                                context.drawImage(image, 0, 0, width, height);
                                const buffer = new Uint8Array(
                                    context.getImageData(0, 0, width, height).data
                                );

                                const object = this.createInstance(
                                    InstanceType.BITMAP,
                                    name || file.name,
                                    library_id || workSpace.nextLibraryId
                                );

                                workSpace
                                    ._$nameMap
                                    .set(path, object.id);

                                // ドロップしたアイテムをアクティブ化
                                const element = document
                                    .getElementById(`library-child-id-${object.id}`);

                                if (element) {
                                    this.activeInstances.set(object.id, element);

                                    element
                                        .classList
                                        .add("active");
                                }

                                object.width     = image.width;
                                object.height    = image.height;
                                object.imageType = file.type;
                                object.buffer    = new Uint8Array(buffer);

                                const instance = workSpace.addLibrary(object);

                                if (folder_id) {

                                    instance.folderId = folder_id;

                                    const folder = workSpace.getLibrary(folder_id);

                                    this.updateFolderStyle(folder, folder.mode);
                                }

                                // ライブラリ選択のselectを更新
                                Util
                                    .$instanceSelectController
                                    .createInstanceSelect(instance);

                                // ライブラリ一覧を再構成
                                Util.$libraryController.reload();

                                // プレビューを表示
                                Util.$libraryPreview.loadImage(instance.id);

                                // 上書きならスクリーンを再描画
                                if (library_id) {
                                    this.reloadScreen(library_id);
                                }
                            });

                    });
                break;

            case "video/mp4":
                file
                    .arrayBuffer()
                    .then((buffer) =>
                    {
                        const blob = new Blob([buffer], {
                            "type": file.type
                        });

                        const video = document.createElement("video");
                        video.onloadedmetadata = () =>
                        {
                            const object = this.createInstance(
                                InstanceType.VIDEO,
                                name || file.name,
                                library_id || workSpace.nextLibraryId
                            );

                            workSpace
                                ._$nameMap
                                .set(path, object.id);

                            // ドロップしたアイテムをアクティブ化
                            const element = document
                                .getElementById(`library-child-id-${object.id}`);

                            if (element) {
                                this.activeInstances.set(object.id, element);

                                element
                                    .classList
                                    .add("active");
                            }

                            object.width  = video.videoWidth;
                            object.height = video.videoHeight;
                            object.buffer = new Uint8Array(buffer);

                            const instance = workSpace.addLibrary(object);
                            if (folder_id) {

                                instance.folderId = folder_id;

                                const folder = workSpace.getLibrary(folder_id);

                                this.updateFolderStyle(folder, folder.mode);
                            }

                            // ライブラリ選択のselectを更新
                            Util
                                .$instanceSelectController
                                .createInstanceSelect(instance);

                            // ライブラリ一覧を再構成
                            Util.$libraryController.reload();

                            // プレビューを表示
                            Util.$libraryPreview.loadImage(instance.id);

                            // 上書きならスクリーンを再描画
                            if (library_id) {
                                this.reloadScreen(library_id);
                            }
                        };

                        video.src = URL.createObjectURL(blob);
                        video.load();
                    });
                break;

            case "audio/mpeg":
                file
                    .arrayBuffer()
                    .then((buffer) =>
                    {
                        const object = this.createInstance(
                            InstanceType.SOUND,
                            name || file.name,
                            library_id || workSpace.nextLibraryId
                        );

                        workSpace
                            ._$nameMap
                            .set(path, object.id);

                        // ドロップしたアイテムをアクティブ化
                        const element = document
                            .getElementById(`library-child-id-${object.id}`);

                        if (element) {
                            this.activeInstances.set(object.id, element);

                            element
                                .classList
                                .add("active");
                        }

                        object.buffer = new Uint8Array(buffer);

                        const instance = workSpace.addLibrary(object);

                        if (folder_id) {

                            instance.folderId = folder_id;

                            const folder = workSpace.getLibrary(folder_id);

                            this.updateFolderStyle(folder, folder.mode);

                        }

                        // ライブラリ一覧を再構成
                        Util.$libraryController.reload();

                        // プレビューを表示
                        Util.$libraryPreview.loadImage(instance.id);

                        // 上書きならスクリーンを再描画
                        if (library_id) {
                            this.reloadScreen(library_id);
                        }
                    });
                break;

            case "application/x-shockwave-flash":
                file
                    .arrayBuffer()
                    .then((buffer) =>
                    {
                        new ReComposition()
                            .setData(new Uint8Array(buffer))
                            .run(name || file.name, folder_id, library_id);
                    });
                break;

            default:
                break;

        }
    }

    /**
     * @description フォルダ外に移動
     *
     * @return {void}
     * @method
     * @public
     */
    folderOut ()
    {
        if (!this.activeInstances.size) {
            return ;
        }

        for (const element of this.activeInstances.values()) {

            const instance = Util
                .$currentWorkSpace()
                .getLibrary(
                    element.dataset.libraryId | 0
                );

            if (!instance) {
                continue;
            }

            // スタイルを初期化
            if (instance.folderId) {

                instance.folderId = 0;

                element.style.display     = "";
                element.style.paddingLeft = "";

            }

        }
    }

    /**
     * @description フォルダーにコンテンツを移動する
     *
     * @param  {DragEvent} event
     * @return {void}
     * @method
     * @public
     */
    folderIn (event)
    {
        if (!this.activeInstances.size) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();

        const folderElement = event.currentTarget;
        const folder = workSpace
            .getLibrary(folderElement.dataset.libraryId | 0);

        // 移動元にフォルダーがある場合、移動先が同一のフォルダかチェックする
        const elements = [];
        for (const element of this.activeInstances.values()) {

            const instance = workSpace
                .getLibrary(element.dataset.libraryId | 0);

            if (instance.type !== InstanceType.FOLDER) {
                elements.push(element);
                continue;
            }

            // 自分自身への移動をブロック
            if (instance.id === folder.id) {
                continue;
            }

            // 移動元が子のフォルダーに移動してないかチェック
            if (folder.folderId) {

                let folderId = folder.folderId;
                while (folderId) {
                    const library = workSpace.getLibrary(folderId);
                    if (!library) {
                        break;
                    }

                    if (folderId === instance.id) {
                        break;
                    }

                    folderId = library.folderId;
                    if (!folderId) {
                        elements.push(element);
                        break;
                    }
                }

            } else {

                elements.push(element);

            }
        }

        // 移動対象がなければ終了
        if (!elements.length) {
            return ;
        }

        this.save();

        event.stopPropagation();
        event.preventDefault();

        for (let idx = 0; idx < elements.length; ++idx) {

            const element = elements[idx];

            const instance = workSpace
                .getLibrary(element.dataset.libraryId | 0);

            // 格納するフォルダのIDをセット
            instance.folderId = folder.id;
        }

        // ライブラリを再構成
        this.reload();

        // 初期化
        this._$saved = false;
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

    /**
     * @description スクリーンエリアで変更があったElementを再描画
     *
     * @param  {number} library_id
     * @return {void}
     * @method
     * @public
     */
    reloadScreen (library_id)
    {
        Util.$changeLibraryId = library_id;
        const frame = Util.$timelineFrame.currentFrame;

        Util
            .$currentWorkSpace()
            .scene
            .changeFrame(frame);

        Util.$changeLibraryId = 0;
    }
}

Util.$libraryController = new LibraryController();
