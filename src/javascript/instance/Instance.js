/**
 * 全てのライブラリの親クラス
 * Parent class for all libraries
 *
 * @class
 * @memberOf instance
 */
class Instance
{
    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object)
    {
        this._$id         = object.id;
        this._$name       = object.name;
        this._$type       = object.type;
        this._$symbol     = object.symbol || "";
        this._$folderId   = object.folderId | 0;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    toObject () {}

    /**
     * @description 書き出し用のObjectを返す
     *              Returns an Object for export
     *
     * @return {object}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    toPublish () {}

    /**
     * @description シンボルを指定した時の継承先を返す
     *              Returns the inheritance destination when a symbol is specified.
     *
     * @readonly
     * @abstract
     */
    // eslint-disable-next-line no-empty-function,getter-return
    get defaultSymbol () {}

    /**
     * @description Next2DのDisplayObjectを生成
     *              Generate Next2D DisplayObject
     *
     * @return {*}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    createInstance () {}

    /**
     * @description 表示領域(バウンディングボックス)のObjectを返す
     *              Returns the Object of the display area (bounding box)
     *
     * @param  {array}  [matrix=null]
     * @param  {object} [place=null]
     * @param  {object} [range=null]
     * @return {object}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-empty-function,no-unused-vars
    getBounds (matrix = null, place = null, range = null) {}

    /**
     * @description ライブラリ内のユニークな値
     *              Unique value in the library
     *
     * @member {number}
     * @public
     */
    get id ()
    {
        return this._$id;
    }
    set id (id)
    {
        this._$id = id | 0;
    }

    /**
     * @description 格納先のフォルダID
     *              Destination folder ID
     *
     * @default 0
     * @member {number}
     * @public
     */
    get folderId ()
    {
        return this._$folderId;
    }
    set folderId (folder_id)
    {
        this._$folderId = folder_id | 0;
    }

    /**
     * @description フォルダを含めたライブラリのパスを返す
     *              Returns the path to the library, including folders
     *
     * @member {string}
     * @readonly
     * @public
     */
    get path ()
    {
        const workSpace = Util.$currentWorkSpace();

        let path = this._$name;
        if (this._$folderId) {
            let parent = this;
            while (parent._$folderId) {
                parent = workSpace.getLibrary(parent._$folderId);
                path = `${parent._$name}/${path}`;
            }
        }

        return path;
    }

    /**
     * @description 指定したワークスペースからPathを取得
     *              Get Path from the specified workspace
     *
     * @param  {WorkSpace} work_space
     * @return {string}
     * @method
     * @public
     */
    getPathWithWorkSpace (work_space)
    {
        let path = this._$name;
        if (this._$folderId) {
            let parent = this;
            while (parent._$folderId) {
                parent = work_space.getLibrary(parent._$folderId);
                path = `${parent._$name}/${path}`;
            }
        }

        return path;
    }

    /**
     * @description ライブラリ名、フォルダのパスを含めた名前をユニークとして利用する
     *              Use the name including the library name and folder path as unique
     *
     * @member {string}
     * @public
     */
    get name ()
    {
        return this._$name;
    }
    set name (name)
    {
        this._$name = `${name}`;

        if (this.id) {
            // ライブラリのelementのテキストも更新
            const element = document
                .getElementById(`library-name-${this.id}`);
            if (element) {
                element.textContent = `${this._$name}`;
            }
        }

        // コントローラーに表示中のシーンの場合は、コントローラー表示も更新
        const workSpace = Util.$currentWorkSpace();
        if (workSpace && workSpace.scene.id === this.id) {

            const objectName = document.getElementById("object-name");
            if (objectName) {
                objectName.value = `${this._$name}`;
            }

            const sceneName = document.getElementById("scene-name");
            if (sceneName) {
                sceneName.textContent = `${this._$name}`;
            }

        }

    }

    /**
     * @description ライブラリの方の値、InstanceTypeクラスの固定値を参照
     *              See the value toward the library, fixed value in the InstanceType class.
     *
     * @member {string}
     * @public
     */
    get type ()
    {
        return this._$type;
    }
    set type (type)
    {
        type = `${type}`.toLowerCase();
        switch (type) {

            case InstanceType.SHAPE:
            case InstanceType.BITMAP:
            case InstanceType.VIDEO:
            case InstanceType.FOLDER:
            case InstanceType.SOUND:
            case InstanceType.MOVIE_CLIP:
            case InstanceType.TEXT:
                this._$type = type;
                break;

            default:
                break;

        }
    }

    /**
     * @description Next2D Playerでのシンボルアクセス用の値
     *              Value for symbol access in Next2D Player
     *
     * @member {string}
     * @public
     */
    get symbol ()
    {
        return this._$symbol;
    }
    set symbol (symbol)
    {
        this._$symbol = `${symbol}`;

        if (this.id) {
            // ライブラリ内のelementのテキストデータも更新
            const element = document
                .getElementById(`library-symbol-name-${this.id}`);
            if (element) {
                element.textContent = `${symbol}`;
            }
        }
    }

    /**
     * @description このアイテムが設定されたDisplayObjectが選択された時
     *              内部情報をコントローラーに表示する
     *              When a DisplayObject with this item set is selected,
     *              internal information is displayed on the controller.
     *
     * @param {object} place
     * @param {string} [name=""]
     * @public
     */
    showController (place, name = "")
    {
        Util.$controller.hideObjectSetting([
            "sound-setting",
            "ease-setting"
        ]);

        Util.$controller.showObjectSetting([
            "object-setting",
            "reference-setting",
            "transform-setting",
            "color-setting",
            "blend-setting",
            "filter-setting",
            "instance-setting"
        ]);

        // 選択されたインスタンス名をセット
        Util
            .$instanceSelectController
            .createInstanceSelect(this);

        const matrix = place.matrix;

        // 名前とシンボルの値をセット
        document
            .getElementById("object-name")
            .value = name;

        document
            .getElementById("object-symbol")
            .value = this.symbol;

        const xScale = "scaleX" in place
            ? place.scaleX
            : Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);

        document
            .getElementById("transform-scale-x")
            .value = `${+(xScale * 100).toFixed(2)}`;

        const yScale = "scaleY" in place
            ? place.scaleY
            : Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        document
            .getElementById("transform-scale-y")
            .value = `${+(yScale * 100).toFixed(2)}`;

        const rotation = "rotation" in place
            ? place.rotation
            : Math.atan2(matrix[1], matrix[0]) * Util.$Rad2Deg;

        document
            .getElementById("transform-rotate")
            .value = `${rotation | 0}`;

        // ColorTransformの値をセット
        const colorTransform = place.colorTransform;

        document
            .getElementById("color-red-multiplier")
            .value = colorTransform[0] * 100;
        document
            .getElementById("color-green-multiplier")
            .value = colorTransform[1] * 100;
        document
            .getElementById("color-blue-multiplier")
            .value = colorTransform[2] * 100;
        document
            .getElementById("color-alpha-multiplier")
            .value = colorTransform[3] * 100;

        document
            .getElementById("color-red-offset")
            .value = colorTransform[4];
        document
            .getElementById("color-green-offset")
            .value = colorTransform[5];
        document
            .getElementById("color-blue-offset")
            .value = colorTransform[6];
        document
            .getElementById("color-alpha-offset")
            .value = colorTransform[7];

        // 指定したブレンドモードにselectedを設定
        const children = document
            .getElementById("blend-select")
            .children;

        for (let idx = 0; idx < children.length; ++idx) {

            const node = children[idx];

            if (node.value !== place.blendMode) {
                continue;
            }

            node.selected = true;
            break;
        }

        // フィルター情報を初期化
        Util.$filterController.clear();

        // フィルターがあれば対象のElementを追加
        const length = place.filter.length;
        if (length) {
            document
                .querySelectorAll(".filter-none")[0]
                .style.display = "none";
        }

        for (let idx = 0; idx < length; ++idx) {
            const filter = place.filter[idx];
            Util.$filterController[`add${filter.name}`](filter, false);
        }
    }

    /**
     * @description Next2DのBitmapDataクラスを経由してImageクラスを生成
     *              Generate Image class via Next2D BitmapData class
     *
     * @param  {HTMLCanvasElement} canvas
     * @param  {number}  width
     * @param  {number}  height
     * @param  {object}  place
     * @param  {object}  [range = null]
     * @param  {number}  [static_frame = 0]
     * @param  {boolean} [preview = false]
     * @return {Promise}
     * @method
     * @public
     */
    draw (
        canvas, width, height, place,
        range = null, static_frame = 0, preview = false
    ) {

        // empty image
        if (!width || !height) {
            canvas.width  = 0;
            canvas.height = 0;
            return Promise.resolve(canvas);
        }

        // ライブラリからplayer用のオブジェクトを作成
        const instance = this.createInstance(
            place, range, static_frame, preview
        );

        // place objectの値をセット
        let matrix = place.matrix;
        if (!preview && Util.$sceneChange.matrix.length) {
            matrix = Util.$multiplicationMatrix(
                Util.$sceneChange.concatenatedMatrix,
                place.matrix
            );
        }

        const container = this.createContainer(
            instance, place, matrix, preview
        );

        // フィルターの描画反映を計算してセット
        const object = this.calcFilter(width, height, place);
        if (object.filters.length) {
            instance._$transform._$filters = object.filters;
        }

        // BitmapDataオブジェクトを作成
        const bitmapData = this.createBitmapData(
            object.width, object.height, preview
        );

        canvas.width  = object.width;
        canvas.height = object.height;

        const sacle = window.devicePixelRatio;
        const ratio = !preview
            ? window.devicePixelRatio * Util.$zoomScale
            : window.devicePixelRatio;

        const drawBounds = container.getBounds(container);

        let tx = -drawBounds.x * sacle;
        if (0 > object.offsetX) {
            tx -= object.offsetX * ratio;
        }

        let ty = -drawBounds.y * sacle;
        if (0 > object.offsetY) {
            ty -= object.offsetY * ratio;
        }

        canvas._$width   = object.width;
        canvas._$height  = object.height;
        canvas.draggable = false;

        const bounds = this.getBounds(
            matrix, place, range, static_frame
        );

        canvas._$tx = bounds.xMin;
        canvas._$ty = bounds.yMin;

        canvas._$offsetX = 0 > object.offsetX ? object.offsetX : 0;
        canvas._$offsetY = 0 > object.offsetY ? object.offsetY : 0;

        // playerで描画を実行
        return new Promise((resolve) =>
        {
            const { Matrix } = window.next2d.geom;

            bitmapData.draw(
                container,
                new Matrix(sacle, 0, 0, sacle, tx, ty),
                null,
                canvas,
                resolve
            );
        });
    }

    /**
     * @description 指定されたFilterの描画範囲を計算
     *              Calculates the drawing range of the specified Filter
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {object} place
     * @return {object}
     * @method
     * @public
     */
    calcFilter (width, height, place)
    {
        const { Rectangle } = window.next2d.geom;

        let xScale = Math.sqrt(
            place.matrix[0] * place.matrix[0]
            + place.matrix[1] * place.matrix[1]
        );

        let yScale = Math.sqrt(
            place.matrix[2] * place.matrix[2]
            + place.matrix[3] * place.matrix[3]
        );

        const object = {
            "width":   width,
            "height":  height,
            "offsetX": 0,
            "offsetY": 0,
            "filters": []
        };

        if (place.filter.length) {

            let rect = new Rectangle(0, 0, width, height);

            for (let idx = 0; idx < place.filter.length; ++idx) {

                const filter = place.filter[idx];
                if (!filter.state) {
                    continue;
                }

                const instance = filter.createInstance();

                rect = instance._$generateFilterRect(rect, xScale, yScale);

                object.filters.push(instance);

            }

            object.width  = Math.ceil(rect.width);
            object.height = Math.ceil(rect.height);

            object.offsetX = rect.x;
            object.offsetY = rect.y;
        }

        return object;
    }

    /**
     * @description BitmapDataに渡すSpriteを生成
     *              Generate Sprite to be passed to BitmapData
     *
     * @param  {DisplayObject} instance
     * @param  {object} place
     * @param  {array} matrix
     * @param  {boolean} [preview=false]
     * @return {next2d.display.Sprite}
     * @method
     * @public
     */
    createContainer (instance, place, matrix, preview = false)
    {
        const { Sprite } = window.next2d.display;
        const { Matrix, ColorTransform } = window.next2d.geom;

        instance
            ._$transform
            ._$matrix = new Matrix(
                matrix[0], matrix[1],
                matrix[2], matrix[3],
                matrix[4], matrix[5]
            );

        // fixed logic
        instance
            ._$transform
            ._$colorTransform = new ColorTransform(
                place.colorTransform[0], place.colorTransform[1],
                place.colorTransform[2], place.colorTransform[3],
                place.colorTransform[4], place.colorTransform[5],
                place.colorTransform[6], place.colorTransform[7]
            );

        const sprite = new Sprite();
        sprite.addChild(instance);

        let ratio = 1;
        if (!preview) {
            ratio *= Util.$zoomScale;
        }

        sprite.scaleX = ratio;
        sprite.scaleY = ratio;

        const container = new Sprite();
        container.addChild(sprite);

        return container;
    }

    /**
     * @description 幅と高さを指定して、BitmapDataクラスを生成
     *              Generate BitmapData class by specifying width and height
     *
     * @param  {number}  width
     * @param  {number}  height
     * @param  {boolean} [preview=false]
     * @return {next2d.display.BitmapData}
     * @method
     * @public
     */
    createBitmapData (width, height, preview = false)
    {
        const { BitmapData } = window.next2d.display;

        let ratio = window.devicePixelRatio;
        if (!preview) {
            ratio *= Util.$zoomScale;
        }

        return new BitmapData(
            Math.ceil(width  * ratio),
            Math.ceil(height * ratio),
            true, 0
        );
    }

    /**
     * @description プレビュー用のImageクラスを生成
     *              Generate Image class for preview
     *
     * @return {Promise}
     * @method
     * @public
     */
    getPreview ()
    {
        if (this._$type === InstanceType.FOLDER) {
            return Promise.resolve();
        }

        const bounds = this.getBounds([1, 0, 0, 1, 0, 0]);

        // size
        let width  = Math.abs(bounds.xMax - bounds.xMin);
        let height = Math.abs(bounds.yMax - bounds.yMin);
        if (!width || !height) {
            return Promise.resolve();
        }

        let scaleX   = 1;
        const scaleY = 150 / height;

        width  = width  * scaleY | 0;
        height = height * scaleY | 0;

        const controllerWidth = (document
            .documentElement
            .style
            .getPropertyValue("--controller-width")
            .split("px")[0] | 0) - 10;

        if (width > controllerWidth) {
            scaleX = controllerWidth / width;
            width  = width  * scaleX | 0;
            height = height * scaleX | 0;
        }

        return this
            .draw(
                Util.$getCanvas(),
                Math.ceil(width),
                Math.ceil(height),
                {
                    "frame": 1,
                    "matrix": [scaleY * scaleX, 0, 0, scaleY * scaleX, 0, 0],
                    "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                    "blendMode": "normal",
                    "filter": []
                },
                null, 0, true
            )
            .then((canvas) =>
            {
                const minHeight = Math.min(150, height);
                canvas.style.width  = `${width * minHeight / height}px`;
                canvas.style.height = `${minHeight}px`;

                return Promise.resolve(canvas);
            });
    }

    /**
     * @description ライブラリからの削除処理、配置先からも削除を行う
     *              Process deletion from the library and also from the placement site.
     *
     * @return {void}
     * @method
     * @public
     */
    remove ()
    {
        const workSpace = Util.$currentWorkSpace();

        const scene = workSpace.scene;
        for (let instance of workSpace._$libraries.values()) {

            if (instance.type !== InstanceType.MOVIE_CLIP) {
                continue;
            }

            // 削除するインスタンスならスキップ
            if (instance.id === this.id) {
                continue;
            }

            for (let layer of instance._$layers.values()) {

                let reload = false;

                // 削除してもいいようにクローンして利用する
                const characters = layer._$characters.slice();

                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];
                    if (this.id === character.libraryId) {

                        for (const keyFrame of character._$places.keys()) {

                            const range = character.getRange(keyFrame);

                            // 空のキーフレームがあればスキップ
                            if (layer.getActiveEmptyCharacter(keyFrame)) {
                                continue;
                            }

                            // DisplayObjectが配置されていればスキップ
                            const activeCharacters = layer.getActiveCharacter(keyFrame);
                            let done = false;
                            for (let idx = 0; idx < activeCharacters.length; ++idx) {

                                const activeCharacter = activeCharacters[idx];
                                if (activeCharacter.id === character.id) {
                                    continue;
                                }

                                done = true;
                            }

                            if (done) {
                                continue;
                            }

                            // 削除するレンジに空のキーフレームを登録
                            layer.addEmptyCharacter(new EmptyCharacter({
                                "startFrame": range.startFrame,
                                "endFrame": range.endFrame
                            }));
                        }

                        // 登録先のレイヤーから削除
                        layer.deleteCharacter(character.id);
                        reload = true;
                    }
                }

                // 表示中のレイヤーならスタイルを更新
                if (reload && scene.id === instance.id) {
                    layer.reloadStyle();
                }
            }

            if (instance._$sounds.size) {
                for (const [frame, sounds] of instance._$sounds) {

                    const pool = [];
                    for (let idx = 0; idx < sounds.length; ++idx) {

                        const sound = sounds[idx];
                        if (this.id === sound.characterId) {
                            continue;
                        }

                        pool.push(sound);
                    }

                    // 削除対象以外を再登録
                    instance._$sounds.set(frame, pool);
                }
            }
        }
    }
}
