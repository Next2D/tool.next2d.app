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
         * @type {Map}
         * @private
         */
        this._$mapping = new Map();

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$deleteCommand = null;

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

            case Util.$ctrlKey:
                break;

            case Util.$shiftKey:
                break;

            default:

                // 初期化
                for (const element of this.activeInstances.values()) {
                    element
                        .classList
                        .remove("active");
                }
                this.activeInstances.clear();

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

        this._$deleteCommand = this.deleteCommand.bind(this);

        const element = document
            .getElementById("library-list-box");
        if (element) {
            element.addEventListener("mouseleave", () =>
            {
                this.removeDeleteEvent();
            });

            element.addEventListener("dragover", function (event)
            {
                event.preventDefault();
            });

            element.addEventListener("drop", (event) =>
            {
                this.drop(event);
            });
        }

        // 終了コール
        Util.$initializeEnd();
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
        // 指定がなければ現在のタブのライブラリを使用する
        if (!libraries) {
            libraries = Array.from(
                Util.$currentWorkSpace()._$libraries.values()
            );
        }

        // ライブラリ一覧を初期化
        const library = document
            .getElementById("library-list-box");

        while (library.children.length) {
            library.children[0].remove();
        }

        // サウンド情報を初期化
        const select = document
            .getElementById("sound-select");

        while (select.children.length) {
            select.children[0].remove();
        }

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

        // 名前のマッピングを初期化
        this._$mapping.clear();

        const folderMap   = new Map();
        const childrenMap = new Map();

        // ライブラリにセット
        for (let idx = 0; idx < libraries.length; ++idx) {

            const value = libraries[idx];

            this._$mapping.set(value.name, value.id);

            if (!value.id) {
                continue;
            }

            Util
                .$libraryController
                .createInstance(
                    value.type, value.name, value.id, value.symbol
                );

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
                    for (let idx = 0; idx < children.length; ++idx) {

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
    }

    /**
     * @description 削除イベントを無効化
     *
     * @return {void}
     * @method
     * @public
     */
    removeDeleteEvent ()
    {
        window.removeEventListener("keydown", this._$deleteCommand);
    }

    /**
     * @description 削除を実行
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    deleteCommand (event)
    {
        // 削除キー以外はスキップ
        switch (event.code) {

            case "Delete":
            case "Backspace":
                break;

            default:
                return ;

        }

        this.save();

        this._$saved = false;
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
        <i class="library-type-${type === "folder" ? "arrow close" : "space"}" id="arrow-${id}" data-library-id="${id}"></i>
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
                .addEventListener("dblclick", Util.$changeScene);
        }

        const child = document
            .getElementById(`library-child-id-${id}`);

        // elementの選択処理
        child.addEventListener("mousedown", (event) =>
        {
            if (Util.$keyLock) {
                return ;
            }

            const target = event.currentTarget;

            this.activeInstance = target;

            // プレビューに表示
            Util
                .$libraryPreview
                .loadImage(
                    target.dataset.libraryId | 0
                );
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
        if (event.code === "Enter") {
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

            const nameElement = document
                .getElementById(viewId);

            // データを更新
            library[target.dataset.type] = target.value;
            nameElement.textContent      = target.value;
            nameElement.style.display    = "";

            const parent = document
                .getElementById(`library-child-id-${libraryId}`);

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

            if (instance.type === "folder") {
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

        const items = event.dataTransfer.items;
        if (items.length) {

            const items = event.dataTransfer.items;
            for (let idx = 0; idx < items.length; ++idx) {
                this.scanFiles(
                    items[idx].webkitGetAsEntry()
                );
            }

        } else {

            this.folderOut(event);

        }
    }

    /**
     * @description 読み込んだファイルのチェック
     *
     * @param  {DirectoryEntry} entry
     * @param  {number} [folder_id=0 ]
     * @return {Promise<void>}
     * @method
     * @public
     */
    scanFiles (entry, folder_id)
    {
        // TODO
    }

    /**
     * @description フォルダ外に移動
     *
     * @param  {DragEvent} event
     * @return {void}
     * @method
     * @public
     */
    folderOut (event)
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

        // 再読み込み
        this.reload();
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

        this.save();

        event.stopPropagation();
        event.preventDefault();

        const workSpace = Util.$currentWorkSpace();

        const folderElement = event.currentTarget;
        const folder = workSpace
            .getLibrary(folderElement.dataset.libraryId | 0);

        for (const element of this.activeInstances.values()) {

            const instance = workSpace
                .getLibrary(element.dataset.libraryId | 0);

            // 格納するフォルダのIDをセット
            instance.folderId = folder.id;
        }

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
}

Util.$libraryController = new LibraryController();
