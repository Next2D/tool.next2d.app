/**
 * @class
 */
class WorkSpace
{
    /**
     * @param {string} json
     * @constructor
     */
    constructor (json = "")
    {
        this._$name        = "";
        this._$stage       = null;
        this._$libraries   = new Map();
        this._$plugins     = [];
        this._$position    = 0;
        this._$characterId = 0;
        this._$revision    = [];
        this._$currentData = null;

        if (json) {
            this.load(json);
        }

        if (!this._$libraries.has(0)) {

            const root = new MovieClip({
                "id": 0,
                "type": "container",
                "name": "main",
                "symbol": ""
            });

            this._$libraries.set(0, root);
        }

        if (!this._$stage) {
            this._$stage = new Stage();
        }

    }

    /**
     * @return {void}
     * @public
     */
    run ()
    {
        // ステージをセット
        this.stage.initialize();

        // 初期化
        this.initialize(this.root);
    }

    /**
     * @param  {MovieClip} scene
     * @return {void}
     * @public
     */
    initialize (scene)
    {
        // シーンをセット
        this.scene = scene;

        // ライブラリを初期化
        this.initializeLibrary();

        // 内部スクリプトを初期化
        Util.$javascriptController.reload();

        // プラグインを初期化
        this.initializePlugin();
    }

    /**
     * @return {void}
     * @public
     */
    initializeLibrary ()
    {
        const library = document.getElementById("library-list-box");

        while (library.children.length) {
            library.children[0].remove();
        }

        const select = document
            .getElementById("sound-select");

        while (select.children.length) {
            select.children[0].remove();
        }

        const folderMap   = new Map();
        const childrenMap = new Map();

        // ライブラリにセット
        for (const value of this._$libraries.values()) {

            if (!value.id) {
                continue;
            }

            Util.$controller.createContainer(
                value.type, value.name, value.id, value.symbol
            );

            // fixed logic
            if (value.type === "folder" && value.mode === Util.FOLDER_OPEN) {
                const element = document
                    .getElementById(`folder-${value.id}`);

                element.classList.remove("library-type-folder-close");
                element.classList.add("library-type-folder-open");
            }

            if (value.folderId) {

                const element = document
                    .getElementById(`library-child-id-${value.id}`);

                element.remove();

                if (!childrenMap.has(value.folderId)) {
                    childrenMap.set(value.folderId, []);
                }

                childrenMap.get(value.folderId).unshift(element);
            }

            if (value.type === "folder") {
                folderMap.set(value.id, value);
            }
        }

        if (folderMap.size) {

            for (const [folderId, folder] of folderMap) {

                if (!childrenMap.has(folderId)) {
                    continue;
                }

                const element = document
                    .getElementById(`library-child-id-${folder.id}`);

                const children = childrenMap.get(folderId);
                for (let idx = 0; idx < children.length; ++idx) {

                    const child = children[idx];

                    element.parentNode.insertBefore(
                        child, element.nextElementSibling
                    );

                }

            }

            for (const folder of folderMap.values()) {

                if (folder.folderId) {
                    continue;
                }

                Util.$controller.updateFolderStyle(folder, folder.mode);
            }

            folderMap.clear();
            childrenMap.clear();
        }
    }

    /**
     * @return {void}
     * @public
     */
    initializePlugin ()
    {
        const element = document
            .getElementById("plugin-list-box");

        while (element.children.length) {
            element.children[0].remove();
        }

        for (let idx = 0; idx < this._$plugins.length; ++idx) {
            const plugin = this._$plugins[idx];
            Util.$controller.appendNode(plugin.name, idx);
            Util.$controller.appendScript(plugin.src);
        }
    }

    /**
     * @return {void}
     * @public
     */
    stop ()
    {
        if (this._$scene) {
            this._$scene.stop();
            this._$scene = null;
        }
    }

    /**
     * @return {MovieClip}
     * @public
     */
    get scene ()
    {
        return this._$scene;
    }

    /**
     * @param  {MovieClip} scene
     * @return {void}
     * @public
     */
    set scene (scene)
    {
        if (this._$scene) {
            this._$scene.stop();
        }

        this._$scene = scene;
        scene.initialize();
    }

    /**
     * @param  {string} json
     * @return {void}
     * @public
     */
    load (json)
    {
        const object = JSON.parse(json);

        // copy
        this._$characterId = object.characterId|0;
        this._$name        = object.name;
        this._$stage       = new Stage(object.stage);
        this._$plugins     = object.plugins || [];

        if (this._$libraries.size) {
            this._$libraries.clear();
        }

        const libraries = object.libraries;
        for (let idx = 0; idx < libraries.length; ++idx) {
            this.addLibrary(libraries[idx]);
        }
    }

    /**
     * @return {string}
     * @public
     */
    toJSON ()
    {
        // ライブラリデータ
        const libraries = [];
        for (const value of this._$libraries.values()) {
            libraries.push(value.toObject());
        }

        return JSON.stringify({
            "version": Util.VERSION,
            "name": this.name,
            "characterId": this._$characterId,
            "stage": this.stage.toObject(),
            "libraries": libraries,
            "plugins": this._$plugins.slice()
        });
    }

    /**
     * @return {void}
     * @public
     */
    async temporarilySaved ()
    {
        Util.$updated = true;
        if (this._$currentData) {
            this._$currentData = null;
        }

        if (this._$position !== this._$revision.length) {
            this._$revision.length = this._$position;
        }

        this._$revision.push(this.toJSON());
        this._$position++;

        // remove old data
        if (this._$revision.length > Util.REVISION_LIMIT) {

            this._$revision.shift();

            this._$position = this._$revision.length;
        }
    }

    /**
     * @return {void}
     * @public
     */
    async undo ()
    {
        if (!this._$position) {
            return ;
        }

        if (!this._$currentData) {
            this._$currentData = this.toJSON();
        }

        const currentSceneId = this._$scene.id;
        this._$scene.stop();
        this._$scene = null;

        this.load(this._$revision[--this._$position]);

        // loadしたデータで初期化
        this.initialize(this.getLibrary(currentSceneId));

        // 再描画
        this.scene.changeFrame(
            Util.$timelineFrame.currentFrame
        );
    }

    /**
     * @return {void}
     * @public
     */
    async redo ()
    {
        if (!this._$revision.length
            || this._$position === this._$revision.length
        ) {
            return ;
        }

        let data = null;
        if ((this._$position + 1) === this._$revision.length) {

            if (!this._$currentData) {
                return ;
            }

            data = this._$currentData;

            this._$position++;
            this._$currentData = null;

        } else {

            data = this._$revision[++this._$position];

        }

        if (!data) {
            return ;
        }

        const currentSceneId = this._$scene.id;
        this._$scene.stop();
        this._$scene = null;

        this.load(data);

        // loadしたデータで初期化
        this.initialize(this.getLibrary(currentSceneId));

        // 再描画
        this.scene.changeFrame(
            Util.$timelineFrame.currentFrame
        );
    }

    /**
     * @return {MovieClip}
     * @readonly
     * @public
     */
    get root ()
    {
        return this._$libraries.get(0);
    }

    /**
     * @return {Stage}
     * @readonly
     * @public
     */
    get stage ()
    {
        return this._$stage;
    }

    /**
     * @return {string}
     * @public
     */
    get name ()
    {
        return this._$name;
    }

    /**
     * @param  {string} name
     * @return {void}
     * @public
     */
    set name (name)
    {
        this._$name = `${name}`;
    }

    /**
     * @param  {object} library
     * @return {object}
     * @public
     */
    addLibrary (library)
    {
        let instance;
        switch (library.type) {

            case "container":
                instance = new MovieClip(library);
                break;

            case "bitmap":
                instance = new Bitmap(library);
                break;

            case "text":
                instance = new TextField(library);
                break;

            case "sound":
                instance = new Sound(library);
                break;

            case "video":
                instance = new Video(library);
                break;

            case "shape":
                instance = new Shape(library);
                break;

            case "folder":
                instance = new Folder(library);
                break;

        }

        this._$libraries.set(instance.id, instance);

        return instance;
    }

    /**
     * @param  {uint} id
     * @return {object}
     * @public
     */
    getLibrary (id)
    {
        return this._$libraries.get(id | 0);
    }

    /**
     * @param  {uint} id
     * @return {void}
     * @public
     */
    removeLibrary (id)
    {
        this._$libraries.delete(id | 0);

        for (let instance of this._$libraries.values()) {

            if (instance.type !== "container") {
                continue;
            }

            for (let layer of instance._$layers.values()) {

                const characters = layer._$characters.slice(0);
                const length = characters.length;
                for (let idx = 0; idx < length; ++idx) {

                    const character = characters[idx];
                    if (character.libraryId !== id) {
                        continue;
                    }

                    layer.deleteCharacter(character.id);

                    for (let frame = character.startFrame;
                         character.endFrame > frame;
                         ++frame
                    ) {

                        if (layer.getActiveCharacter(frame).length) {
                            continue;
                        }

                        Util.$screen.clearFrames(layer, frame, frame + 1);
                    }
                }
            }
        }

        document
            .getElementById("object-area")
            .style
            .display = "none";

        Util.$controller.deleteInstanceSelectOption(id | 0);
        Util.$javascriptController.reload();
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get nextLibraryId ()
    {
        const keys = Array.from(this._$libraries.keys());
        keys.sort(function (a, b)
        {
            if (a > b) {
                return 1;
            }

            if (a < b) {
                return -1;
            }

            return 0;
        });
        return (this._$libraries.get((keys.pop()|0)).id|0) + 1;
    }
}
