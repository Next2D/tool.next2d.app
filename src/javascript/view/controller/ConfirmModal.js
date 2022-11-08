/**
 * ライブラリのアイテムの上書きを確認するモーダルクラス
 * Modal class to confirm overwriting of items in the library
 *
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
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
     * @description 上書き確認のアイテムを格納した配列
     *              Array containing overwrite confirmation items
     *
     * @member {array}
     * @default []
     * @public
     */
    get files ()
    {
        return this._$files;
    }
    set files (files)
    {
        this._$files = files;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
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
     * @description 追加したファイルを全て上書き
     *              Overwrite all added files
     *
     * @return {Promise}
     * @method
     * @public
     */
    executeConfirmAllOverwriting ()
    {
        this.save();

        const promises = [];

        const workSpace = Util.$currentWorkSpace();

        this._$files.unshift(this._$currentObject);
        for (let idx = 0; idx < this._$files.length; ++idx) {

            const object = this._$files[idx];
            if (!object) {
                continue;
            }

            // 上書きするIDを指定
            const libraryId = workSpace._$nameMap.get(object.path);
            switch (object.type) {

                // ライブラリ内での移動処理
                case "move":
                    this._$currentObject = object;
                    this.moveOverwriting(libraryId);
                    break;

                // コピー、ペースト処理
                case "copy":
                    this._$currentObject = object;
                    this.copyOverwriting(libraryId);
                    break;

                // ファイル追加処理
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
        return Promise
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
    }

    /**
     * @description 全ての上書きをスキップ
     *              Skip all overwrites
     *
     * @return {void}
     * @method
     * @public
     */
    executeConfirmAllSkip ()
    {
        for (let idx = 0; idx < this._$files.length; ++idx) {

            const object = this._$files[idx];
            if (object.type !== "copy") {
                continue;
            }

            const layer     = object.layer;
            const character = object.character;

            if (layer && character) {
                layer.deleteCharacter(character.id);
            }
        }

        // 初期化
        this._$currentObject = null;
        this._$files.length  = 0;

        // 非表示に
        this.hide();
    }

    /**
     * @description フォルダの中にあるアイテムを複製
     *
     * @param  {number} from_work_space_id
     * @param  {number} instance_id
     * @param  {Folder} folder
     * @return {void}
     * @method
     * @public
     */
    cloneFolderItem (from_work_space_id, instance_id, folder)
    {
        const fromWorkSpace = Util.$workSpaces[from_work_space_id];
        const toWorkSpace   = Util.$currentWorkSpace();

        for (const instance of fromWorkSpace._$libraries.values()) {

            if (instance.folderId !== instance_id) {
                continue;
            }

            // 既に複製していればスキップ
            if (this._$mapping.has(instance.id)) {
                continue;
            }

            // 重複したアイテムがあれば確認モーダルを表示
            const path = instance.getPathWithWorkSpace(fromWorkSpace);
            if (toWorkSpace._$nameMap.has(path)) {
                this.files.push({
                    "file": instance,
                    "character": null,
                    "layer": null,
                    "path": path,
                    "workSpaceId": from_work_space_id,
                    "type": "copy"
                });
                continue;
            }

            const activeWorkSpaceId = Util.$activeWorkSpaceId;
            Util.$activeWorkSpaceId = from_work_space_id;

            let clone = null;
            if (instance === InstanceType.MOVIE_CLIP) {
                Util.$activeWorkSpaceId = activeWorkSpaceId;
                clone = this.cloneMovieClip(from_work_space_id, instance);
            } else {
                clone = instance.clone();
                Util.$activeWorkSpaceId = activeWorkSpaceId;
            }

            clone._$id = toWorkSpace.nextLibraryId;
            clone.folderId = folder.id;

            // 重複判定用にコピー元のIDをセット
            this._$mapping.set(instance.id, clone._$id);

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

            // フォルダなら中身を複製
            if (clone.type === InstanceType.FOLDER) {
                this.cloneFolderItem(
                    from_work_space_id, instance.id, clone
                );
            }
        }
    }

    /**
     * @description MovieClipを複製
     *
     * @param  {number} from_work_space_id
     * @param  {MovieClip} movie_clip
     * @return {MovieClip}
     * @method
     * @public
     */
    cloneMovieClip (from_work_space_id, movie_clip)
    {
        const fromWorkSpace = Util.$workSpaces[from_work_space_id];
        const toWorkSpace   = Util.$currentWorkSpace();

        const activeWorkSpaceId = Util.$activeWorkSpaceId;
        Util.$activeWorkSpaceId = from_work_space_id;

        // MovieClipを複製
        const movieClip = movie_clip.clone();
        Util.$activeWorkSpaceId = activeWorkSpaceId;

        for (const layer of movieClip._$layers.values()) {

            for (let idx = 0; idx < layer._$characters.length; ++idx) {
                const character = layer._$characters[idx];

                // 既に複製されていればスキップ
                if (this._$mapping.has(character.libraryId)) {
                    character.libraryId = this._$mapping.get(character.libraryId);
                    continue;
                }

                const instance = fromWorkSpace
                    .getLibrary(character.libraryId);

                const path = instance
                    .getPathWithWorkSpace(fromWorkSpace);

                // 重複している場合は確認モーダルを表示
                if (toWorkSpace._$nameMap.has(path)) {
                    this.files.push({
                        "file": instance,
                        "character": character,
                        "layer": layer,
                        "path": path,
                        "workSpaceId": from_work_space_id,
                        "type": "copy"
                    });
                    continue;
                }

                let clone = null;
                if (instance.type === InstanceType.MOVIE_CLIP) {

                    clone = this.cloneMovieClip(from_work_space_id, instance);

                } else {

                    const activeWorkSpaceId = Util.$activeWorkSpaceId;
                    Util.$activeWorkSpaceId = from_work_space_id;

                    clone = instance.clone();
                    Util.$activeWorkSpaceId = activeWorkSpaceId;

                }

                if (!clone) {
                    continue;
                }

                // 新しいIDをセット
                character.libraryId = clone._$id = toWorkSpace.nextLibraryId;
                this._$mapping.set(instance.id, clone.id);

                if (clone.folderId) {
                    this.createFolder(from_work_space_id, instance);
                }

                // 登録
                Util
                    .$libraryController
                    .createInstance(
                        clone.type,
                        clone.name,
                        clone.id,
                        clone.symbol
                    );

                toWorkSpace._$libraries.set(clone.id, clone);
            }
        }

        return movieClip;
    }

    /**
     * @description コピー、ペースト時の上書き処理
     *              Overwrite processing when copying and pasting
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
                if (instance.type !== InstanceType.FOLDER) {

                    for (const library of workSpace._$libraries.values()) {

                        if (library.type !== InstanceType.MOVIE_CLIP) {
                            continue;
                        }

                        for (const layer of library._$layers.values()) {
                            for (let idx = 0; idx < layer._$characters.length; ++idx) {
                                layer._$characters[idx].dispose();
                            }
                        }
                    }
                }

                workSpace.removeLibrary(libraryId);
            }
        }

        const id = this._$mapping.get(instance.id);

        // レイヤーコピーの場合のみ動く関数
        this.addLayer(id);

        // ライブラリに登録がなけれな登録
        if (!workSpace._$libraries.has(id)) {

            // ワークスペースを切り替え
            const activeWorkSpaceId = Util.$activeWorkSpaceId;
            Util.$activeWorkSpaceId = this._$currentObject.workSpaceId;

            let clone = null;
            if (instance.type === InstanceType.MOVIE_CLIP) {
                Util.$activeWorkSpaceId = activeWorkSpaceId;
                clone = this.cloneMovieClip(
                    this._$currentObject.workSpaceId,
                    instance
                );
            } else {
                clone = instance.clone();
                Util.$activeWorkSpaceId = activeWorkSpaceId;
            }

            clone._$id = id;
            if (value) {
                clone._$name = value;
            }

            if (clone.folderId && this._$mapping.has(clone.folderId)) {
                clone.folderId = this._$mapping.get(clone.folderId);
            }

            // 登録
            Util
                .$libraryController
                .createInstance(
                    clone.type,
                    clone.name,
                    clone.id,
                    clone.symbol
                );

            workSpace._$libraries.set(clone.id, clone);
        }
    }

    /**
     * @description コピーするアイテムがフォルダ内にある場合、先祖のフォルダを作成する
     *
     * @param  {number} from_work_space_id
     * @param  {Instance} instance
     * @return {void}
     * @method
     * @public
     */
    createFolder (from_work_space_id, instance)
    {
        const fromWorkSpace = Util.$workSpaces[from_work_space_id];
        const toWorkSpace   = Util.$currentWorkSpace();

        let child  = instance;
        let folder = fromWorkSpace
            .getLibrary(instance.folderId);

        for (;;) {

            const path = folder
                .getPathWithWorkSpace(fromWorkSpace);

            // 既にフォルダがあればIDをセットして終了
            if (toWorkSpace._$nameMap.has(path)) {
                child.folderId = toWorkSpace._$nameMap.get(path);
                break;
            }

            // IDを再発行
            const clone = folder.clone();
            child.folderId = clone._$id = toWorkSpace.nextLibraryId;

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

            // 先祖がなければ終了
            if (!folder.folderId) {
                break;
            }

            child  = folder;
            folder = fromWorkSpace
                .getLibrary(folder.folderId);
        }
    }

    /**
     * @description フォルダの移動時に重複しているアイテムがないかチェック
     *
     * @param  {Folder} folder
     * @param  {string} [parent_path=""]
     * @return {void}
     * @method
     * @public
     */
    checkFolder (folder, parent_path = "")
    {
        const workSpace = Util.$currentWorkSpace();
        for (const instance of workSpace._$libraries.values()) {

            if (instance.folderId !== folder.id) {
                continue;
            }

            if (instance.type === InstanceType.FOLDER) {

                const parentPath = parent_path
                    ? instance.name
                    : `${parent_path}/${instance.name}`;

                this.checkFolder(instance, parentPath);
            }

            instance.folderId = 0;
            const path = parent_path
                ? instance.path
                : `${parent_path}/${instance.path}`;
            instance.folderId = folder.id;

            // 重複チェック
            if (!workSpace._$nameMap.has(path)) {
                continue;
            }

            // 確認モーダルを表示
            Util.$confirmModal.files.push({
                "file": instance,
                "folderId": folder.id,
                "path": path,
                "type": "move"
            });
            Util.$confirmModal.show();
        }
    }

    /**
     * @description 指定フォルダ内にあるアイテムを全て削除する
     *
     * @param  {Folder} folder
     * @return {void}
     * @method
     * @public
     */
    deleteFolderItem (folder)
    {
        const workSpace = Util.$currentWorkSpace();
        for (const instance of workSpace._$libraries.values()) {

            if (instance.folderId !== folder.id) {
                continue;
            }

            if (instance.type === InstanceType.FOLDER) {
                // フォルダなら中身を削除する
                this.deleteFolderItem(instance);
            } else {
                // 削除するアイテムがMovieClipに配置されていれば削除する
                this.removeCharacter(instance.id);
            }

            document
                .getElementById(`library-child-id-${instance.id}`)
                .remove();

            workSpace.removeLibrary(instance.id);
        }
    }

    /**
     * @description 指定のアイテムが配置されていれば削除を行う
     *
     * @param  {number} library_id
     * @return {void}
     * @method
     * @public
     */
    removeCharacter (library_id)
    {
        const workSpace = Util.$currentWorkSpace();
        for (const instance of workSpace._$libraries.values()) {

            if (instance.type !== InstanceType.MOVIE_CLIP) {
                continue;
            }

            for (const layer of instance._$layers.values()) {
                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    const character = layer._$characters[idx];
                    if (character.libraryId !== library_id) {
                        continue;
                    }

                    layer.deleteCharacter(character.id);
                }
            }
        }
    }

    /**
     * @description 登録されてるライブラリ移動時の重複アイテムの上書き処理
     *              Overwrite duplicate items when moving registered libraries
     *
     * @param  {number} library_id
     * @return {void}
     * @method
     * @public
     */
    moveOverwriting (library_id)
    {
        const workSpace = Util.$currentWorkSpace();
        const instance  = this._$currentObject.file;

        // Elementを削除
        const element = document
            .getElementById(`library-child-id-${library_id}`);

        if (element) {
            element.remove();
        }

        // 移動元になっElementを削除
        document
            .getElementById(`library-child-id-${instance.id}`)
            .remove();

        const library = workSpace.getLibrary(library_id);
        instance.folderId = library.folderId;

        // 移動元を配置しているDisplayObjectの情報を書き換え
        if (instance.type !== InstanceType.FOLDER) {

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
                        character.libraryId = library_id;
                        character.dispose();
                    }
                }
            }

        } else {

            // フォルダーの場合は内部データも情報を更新する
            this.deleteFolderItem(library);

            // 移動するフォルダに合わせてアイテムも移動
            for (const library of workSpace._$libraries.values()) {

                if (library.folderId !== instance.id) {
                    continue;
                }

                library.folderId = library_id;
            }

        }

        // 元を削除してIDを差し替え
        workSpace.removeLibrary(instance.id);
        instance._$id = library_id;

        // Elementを追加
        Util
            .$libraryController
            .createInstance(
                instance.type,
                instance.name,
                instance.id,
                instance.symbol
            );

        // 内部データに追加
        workSpace._$libraries.set(instance.id, instance);

        // 再描画前に、現在のシーンのキャッシュをクリア
        const scene = Util.$currentWorkSpace().scene;
        for (const layer of scene._$layers.values()) {
            for (let idx = 0; idx < layer._$characters.length; ++idx) {
                layer._$characters[idx].dispose();
            }
        }
    }

    /**
     * @description 単体の上書きを実行
     *              Perform a single overwrite
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
     * @description レイヤーコピーを実行した際に、レイヤーにDisplayObjectを追加
     *              Add DisplayObject to layer
     *
     * @return {void}
     * @method
     * @public
     */
    addLayer (id)
    {
        // 複製
        const character = this._$currentObject.character;
        if (!character) {
            return ;
        }

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
     * @description 単体アイテムのスキップ処理
     *              Skip processing of single items
     *
     * @return {void}
     * @method
     * @public
     */
    executeConfirmSkip ()
    {
        if (this._$currentObject.type === "copy") {
            const layer     = this._$currentObject.layer;
            const character = this._$currentObject.character;

            if (layer && character) {
                layer.deleteCharacter(character.id);
            }
        }

        this.setup();
    }

    /**
     * @description 上書き確認モーダルを非表示にする
     *              Hide overwrite confirmation modal
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        // 初期化
        this._$state = "hide";

        const element = document
            .getElementById("confirm-modal");

        if (element) {
            element.setAttribute("class", "fadeOut");
        }
    }

    /**
     * @description 上書き確認モーダルを表示
     *              Display overwrite confirmation modal
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

        const element = document
            .getElementById("confirm-modal");

        if (element) {
            element.setAttribute("class", "fadeIn");
        }

        this.setup();
    }

    /**
     * @description 配列にアイテムがあれば表示、なければモーダル表示を終了
     *              If there are items in the array, display them; if not, exit modal display
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

            // レイヤーを再描画
            if (this._$layers.size) {
                for (const layer of this._$layers.values()) {
                    layer.setCharacterStyle();
                }
            }

            // reset
            this._$layers.clear();
            this._$mapping.clear();

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
                if (this._$currentObject.type === "copy") {

                    // ワークスペースを切り替え
                    const activeWorkSpaceId = Util.$activeWorkSpaceId;
                    Util.$activeWorkSpaceId = this._$currentObject.workSpaceId;

                    // プレビューを生成して、ワークスペースを切り替え
                    afterElement
                        .appendChild(
                            this._$currentObject.file.getPreview()
                        );
                    Util.$activeWorkSpaceId = activeWorkSpaceId;

                } else {

                    afterElement
                        .appendChild(
                            this._$currentObject.file.getPreview()
                        );

                }
                break;

        }
    }
}

Util.$confirmModal = new ConfirmModal();
