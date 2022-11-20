/**
 * @class
 * @memberOf global
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
        this._$name            = "";
        this._$scene           = null;
        this._$stage           = null;
        this._$libraries       = new Map();
        this._$nameMap         = new Map();
        this._$plugins         = new Map();
        this._$position        = 0;
        this._$characterId     = 0;
        this._$revision        = [];
        this._$currentData     = null;
        this._$timelineHeight  = TimelineAdjustment.TIMELINE_DEFAULT_SIZE;
        this._$controllerWidth = ControllerAdjustment.DEFAULT_SIZE;

        if (json) {
            this.load(json);
        }

        if (!this._$libraries.has(0)) {

            const root = new MovieClip({
                "id": 0,
                "type": InstanceType.MOVIE_CLIP,
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
     * @description rootのMovieClipを戻す
     *
     * @return {MovieClip}
     * @readonly
     * @public
     */
    get root ()
    {
        return this._$libraries.get(0);
    }

    /**
     * @description プロジェクトのStageオブジェクトを返す
     *
     * @return {Stage}
     * @readonly
     * @public
     */
    get stage ()
    {
        return this._$stage;
    }

    /**
     * @description プロジェクト名を返す
     *
     * @return {string}
     * @public
     */
    get name ()
    {
        return this._$name;
    }

    /**
     * @description プロジェクト名をセット
     *
     * @param  {string} name
     * @return {void}
     * @public
     */
    set name (name)
    {
        this._$name = `${name}`;
    }

    /**
     * @description 現在表示中のシーン(MovieClip)を返す
     *
     * @return {MovieClip}
     * @public
     */
    get scene ()
    {
        return this._$scene;
    }

    /**
     * @description 指定のシーン(MovieClip)を起動する
     *
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
     * @description ライブラリのユニークIDを生成
     *
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

        // 選択中のライブラリを非アクティブに
        Util.$libraryController.clearActive();

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

        // タイムラインの擬似スクロールの座標をセット
        Util.$timelineScroll.setX();

        // スクリーンの表示をrootに変更
        Util.$sceneChange.reload(0);
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
        document
            .documentElement
            .style
            .setProperty(
                "--timeline-height",
                `${this._$timelineHeight}px`
            );

        document
            .documentElement
            .style
            .setProperty(
                "--controller-width",
                `${this._$controllerWidth}px`
            );

        // ステージをセット
        this.stage.initialize();

        // 初期化
        this.initialize(this.root);
    }

    /**
     * @description プロジェクトを停止
     *
     * @return {void}
     * @method
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
     * @description 指定のプロジェクトJSONを読み込む
     *
     * @param  {string} json
     * @return {void}
     * @method
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

        // settings
        if (object.setting) {
            this._$timelineHeight  = object.setting.timelineHeight;
            this._$controllerWidth = object.setting.controllerWidth;
        }
    }

    /**
     * @description プロジェクトのJSONを生成
     *
     * @return {string}
     * @method
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
            "plugins": Array.from(this._$plugins.values()),
            "setting": {
                "timelineHeight": this._$timelineHeight,
                "controllerWidth": this._$controllerWidth
            }
        });
    }

    /**
     * @description メモリに現在のプロジェクトデータを保存
     *
     * @return {void}
     * @method
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
     * @description 保存した一個前のプロジェクトデータを読み込む
     *
     * @return {void}
     * @method
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

        this.reloadData(this._$revision[--this._$position]);
    }

    /**
     * @description 保存した一個先のプロジェクトデータを読み込む
     *
     * @return {void}
     * @method
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

        this.reloadData(data);
    }

    /**
     * @description undo/redoのデータの再読み込み
     *
     * @param  {string} data
     * @return {void}
     * @method
     * @public
     */
    reloadData (data)
    {
        const layerIds = [];
        const targetLayers = Util.$timelineLayer.targetLayers;
        for (const layerId of targetLayers.keys()) {
            layerIds.push(layerId);
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();
        Util.$tools.reset();

        // 値をキャッシュ
        const currentFrame   = this._$scene.currentFrame;
        const currentSceneId = this._$scene.id;

        // シーンを初期化
        this._$scene.stop();
        this._$scene = null;

        // 再読み込み
        this.load(data);

        // loadしたデータでレイヤーを再構築
        const scene = this.getLibrary(currentSceneId);
        scene._$currentFrame = currentFrame;
        this.initialize(scene);

        // 再読み込み
        if (layerIds.length) {

            const ctrlKey = Util.$ctrlKey;
            Util.$ctrlKey = true;
            for (let idx = 0; idx < layerIds.length; ++idx) {

                const element = document
                    .getElementById(`${layerIds[idx]}`);

                if (!element) {
                    continue;
                }

                Util.$timelineLayer.activeLayer(element);
            }

            Util.$ctrlKey = ctrlKey;
        }
    }

    /**
     * @description ライブラリに追加されたObjectをプロジェクト内部に格納
     *
     * @param  {object} library
     * @return {object}
     * @method
     * @public
     */
    addLibrary (library)
    {
        let instance;
        switch (library.type) {

            case InstanceType.MOVIE_CLIP:
                instance = new MovieClip(library);
                break;

            case InstanceType.BITMAP:
                instance = new Bitmap(library);
                break;

            case InstanceType.TEXT:
                instance = new TextField(library);
                break;

            case InstanceType.SOUND:
                instance = new Sound(library);
                break;

            case InstanceType.VIDEO:
                instance = new Video(library);
                break;

            case InstanceType.SHAPE:
                instance = new Shape(library);
                break;

            case InstanceType.FOLDER:
                instance = new Folder(library);
                break;

        }

        this._$libraries.set(instance.id, instance);

        return instance;
    }

    /**
     * @description 指定のライブラリのアイテムを返す
     *
     * @param  {uint} id
     * @return {object}
     * @method
     * @public
     */
    getLibrary (id)
    {
        return this._$libraries.get(id | 0);
    }

    /**
     * @description 指定のライブラリのアイテムを削除
     *
     * @param  {uint} id
     * @return {void}
     * @method
     * @public
     */
    removeLibrary (id)
    {
        this._$libraries.delete(id | 0);
    }
}
