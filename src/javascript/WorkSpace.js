/**
 * @class
 */
class WorkSpace
{
    /**
     * @param {string} [json=""]
     *
     * @constructor
     * @public
     */
    constructor (json = "")
    {
        this._$name        = "";
        this._$stage       = null;
        this._$libraries   = new Map();
        this._$plugins     = new Map();
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
        const init = !this._$scene;
        if (this._$scene) {
            this._$scene.stop();
        }

        this._$scene = scene;
        scene.initialize(init);
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

        const lastLibraryId = this._$libraries.get(keys.pop() | 0).id | 0;
        return lastLibraryId + 1;
    }

    /**
     * @description 初期起動関数
     *
     * @param  {MovieClip} scene
     * @return {void}
     * @public
     */
    initialize (scene)
    {
        // シーンをセット
        this.scene = scene;

        // ライブラリを初期化
        Util.$libraryController.reload(
            Array.from(this._$libraries.values())
        );

        // 内部スクリプトを初期化
        Util.$javascriptController.reload();

        // プラグインを初期化
        Util.$pluginController.reload(
            Array.from(this._$plugins.values())
        );
    }

    /**
     * @description 起動関数
     *
     * @return {void}
     * @method
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
     * @param  {string} json
     * @return {void}
     * @public
     */
    load (json)
    {
        const object = JSON.parse(json);

        // copy
        this._$characterId = object.characterId | 0;
        this._$name        = object.name;
        this._$stage       = new Stage(object.stage);

        if (this._$plugins.size) {
            this._$plugins.clear();
        }

        if (object.plugins) {
            for (let idx = 0; idx < object.plugins.length; ++idx) {
                const plugin = object.plugins[idx];
                this._$plugins.set(plugin.name, plugin);
            }
        }

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
            "plugins": Array.from(this._$plugins.values())
        });
    }

    /**
     * @return {void}
     * @public
     */
    temporarilySaved ()
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
    undo ()
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
    }

    /**
     * @return {void}
     * @public
     */
    redo ()
    {
        if (!this._$revision.length
            || this._$position === this._$revision.length
        ) {
            return ;
        }

        let data = null;
        if (this._$position + 1 === this._$revision.length) {

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
     * @method
     * @public
     */
    removeLibrary (id)
    {
        this._$libraries.delete(id | 0);

        // for (let instance of this._$libraries.values()) {
        //
        //     if (instance.type !== "container") {
        //         continue;
        //     }
        //
        //     for (let layer of instance._$layers.values()) {
        //
        //         const characters = layer._$characters.slice(0);
        //         const length = characters.length;
        //         for (let idx = 0; idx < length; ++idx) {
        //
        //             const character = characters[idx];
        //             if (character.libraryId !== id) {
        //                 continue;
        //             }
        //
        //             layer.deleteCharacter(character.id);
        //
        //             for (let frame = character.startFrame; character.endFrame > frame; ++frame) {
        //
        //                 if (layer.getActiveCharacter(frame).length) {
        //                     continue;
        //                 }
        //
        //                 Util.$screen.clearFrames(layer, frame, frame + 1);
        //             }
        //         }
        //     }
        // }
        //
        // document
        //     .getElementById("object-area")
        //     .style
        //     .display = "none";
        //
        // Util.$controller.deleteInstanceSelectOption(id | 0);
        // Util.$javascriptController.reload();
    }
}
