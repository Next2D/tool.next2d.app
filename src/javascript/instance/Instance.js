/**
 * @class
 */
class Instance
{
    /**
     * @param {object} object
     * @constructor
     */
    constructor (object)
    {
        this._$id       = object.id;
        this._$name     = object.name;
        this._$type     = object.type;
        this._$symbol   = object.symbol;
        this._$folderId = object.folderId | 0;
    }

    /**
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}

    /**
     * @param {object} place
     * @param {string} [name=""]
     * @public
     */
    showController (place, name = "")
    {
        Util.$controller.hideObjectSetting([
            "sound-setting"
        ]);

        Util.$controller.showObjectSetting([
            "object-setting",
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

        // 名前とシンボルの値をセット
        document
            .getElementById("object-name")
            .value = name;

        document
            .getElementById("object-symbol")
            .value = this.symbol;

        // matrixの値をセット
        const matrix  = place.matrix;
        const xScale  = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale  = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
        const radianX = Math.atan2( matrix[1], matrix[0]) * Util.$Rad2Deg;
        const radianY = Math.atan2(-matrix[2], matrix[3]) * Util.$Rad2Deg;

        document
            .getElementById("transform-scale-x")
            .value = Math.abs(Math.ceil(radianX - radianY)) >= 180
                ? xScale * -100
                : xScale * 100;

        document
            .getElementById("transform-scale-y")
            .value = yScale * 100;

        document
            .getElementById("transform-rotate")
            .value = radianX;

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
        Util.$filterController.clearFilters();

        // フィルターがあれば対象のElementを追加
        const filterElement = document
            .getElementById("filter-setting-list");

        const length = place.filter.length;
        if (length) {
            document
                .querySelectorAll(".filter-none")[0]
                .style.display = "none";
        }

        for (let idx = 0; idx < length; ++idx) {
            const filter = place.filter[idx];
            Util
                .$filterController[`add${filter.name}`](
                    filterElement, filter, false
            );
        }
    }

    /**
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    toObject () {}

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {object} place
     * @param  {object} point
     * @param  {boolean} [preview=false]
     * @return {HTMLImageElement}
     * @public
     */
    toImage (width, height, place, point, preview = false)
    {
        // empty image
        if (!width || !height) {
            return Util.$emptyImage;
        }

        const { Sprite, BitmapData } = window.next2d.display;
        const { Matrix, ColorTransform, Rectangle } = window.next2d.geom;

        const instance  = this.createInstance(place, preview);
        const rectangle = instance.getBounds();

        const ratio = window.devicePixelRatio * Util.$zoomScale;
        const multiMatrix = Util.$multiplicationMatrix(
            Util.$multiplicationMatrix(
                [ratio, 0, 0, ratio, 0, 0],
                [
                    place.matrix[0], place.matrix[1],
                    place.matrix[2], place.matrix[3],
                    0, 0
                ]
            ),
            [
                1, 0, 0, 1,
                -(rectangle.width  / 2) - rectangle.x,
                -(rectangle.height / 2) - rectangle.y
            ]
        );

        const matrix = new Matrix(ratio, 0, 0, ratio);
        matrix.translate(
            multiMatrix[4] + width  * ratio / 2,
            multiMatrix[5] + height * ratio / 2
        );

        let xScale = Math.sqrt(
            place.matrix[0] * place.matrix[0]
            + place.matrix[1] * place.matrix[1]
        );

        let yScale = Math.sqrt(
            place.matrix[2] * place.matrix[2]
            + place.matrix[3] * place.matrix[3]
        );

        let offsetX = 0;
        let offsetY = 0;
        if (place.filter.length) {

            let rect = new Rectangle(0, 0, width, height);

            const filters = [];
            for (let idx = 0; idx < place.filter.length; ++idx) {

                const filter = place.filter[idx];
                if (!filter.state) {
                    continue;
                }

                const instance = filter.createInstance();

                rect = instance._$generateFilterRect(rect, xScale, yScale);

                filters.push(instance);

            }
            instance.filters = filters;

            width  = Math.ceil(rect.width);
            height = Math.ceil(rect.height);

            offsetX = rect.x;
            offsetY = rect.y;
        }

        const container = new Sprite();
        const sprite = container.addChild(new Sprite());
        sprite.addChild(instance);

        instance.transform.matrix = new Matrix(
            place.matrix[0], place.matrix[1],
            place.matrix[2], place.matrix[3],
            0, 0
        );
        instance.transform.colorTransform = new ColorTransform(
            place.colorTransform[0], place.colorTransform[1],
            place.colorTransform[2], place.colorTransform[3],
            place.colorTransform[4], place.colorTransform[5],
            place.colorTransform[6], place.colorTransform[7]
        );

        if (0 > offsetX) {
            matrix.translate(-offsetX * ratio, 0);
        }

        if (0 > offsetY) {
            matrix.translate(0, -offsetY * ratio);
        }

        const bitmapData = new BitmapData(
            Math.ceil(width  * ratio),
            Math.ceil(height * ratio),
            true, 0
        );
        bitmapData.draw(container, matrix);

        const image = bitmapData.toImage();
        bitmapData.dispose();

        image.width     = width;
        image.height    = height;
        image._$width   = width;
        image._$height  = height;
        image.draggable = false;

        const bounds = Util.$boundsMatrix(
            this.getBounds(place, preview),
            place.matrix
        );

        image._$tx = bounds.xMin;
        image._$ty = bounds.yMin;

        image._$offsetX = 0 > offsetX ? offsetX : 0;
        image._$offsetY = 0 > offsetY ? offsetY : 0;

        return image;
    }

    /**
     * @abstract
     */
    toPublish () {}

    /**
     * @abstract
     */
    get defaultSymbol () {}

    /**
     * @abstract
     */
    createInstance () {}

    /**
     * @interface
     */
    getBounds () {}

    /**
     * @description ライブラリからの削除処理、配置先からも削除を行う
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

            if (instance.type !== "container") {
                continue;
            }

            for (let layer of instance._$layers.values()) {

                let reload = false;
                const characters = layer._$characters;
                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];
                    if (this.id === character.libraryId) {
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

    /**
     * @return {HTMLImageElement}
     */
    get preview ()
    {
        const bounds = this.getBounds(null, true);

        // size
        let width  = Math.abs(bounds.xMax - bounds.xMin);
        let height = Math.abs(bounds.yMax - bounds.yMin);
        if (!width || !height) {
            return Util.$emptyImage;
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

        const image = this.toImage(
            Math.ceil(width),
            Math.ceil(height),
            {
                "frame": 1,
                "matrix": [scaleY * scaleX, 0, 0, scaleY * scaleX, 0, 0],
                "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                "blendMode": "normal",
                "filter": []
            }, { "x": 0, "y": 0 }, true
        );

        if (image.height !== height) {
            const height  = Math.min(150, image.height);
            image.width  *= height / image.height;
            image.height  = height;
        }

        return image;
    }

    /**
     * @return {number}
     * @public
     */
    get id ()
    {
        return this._$id;
    }

    /**
     * @param  {number} id
     * @return {void}
     * @public
     */
    set id (id)
    {
        this._$id = id | 0;
    }

    /**
     * @return {number}
     * @public
     */
    get folderId ()
    {
        return this._$folderId;
    }

    /**
     * @param  {number} id
     * @return {void}
     * @public
     */
    set folderId (id)
    {
        this._$folderId = id | 0;
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get path ()
    {
        const workSpace = Util.$currentWorkSpace();

        let path = this.name;
        if (this._$folderId) {
            let parent = this;
            while (parent._$folderId) {
                parent = workSpace.getLibrary(parent._$folderId);
                path = `${parent.name}/${path}`;
            }
        }

        return path;
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

        if (this.id) {
            const libraryElement = document
                .getElementById(`library-name-${this.id}`);
            libraryElement.textContent = this._$name;
        }

        if (Util.$currentWorkSpace().scene.id === this.id) {
            document
                .getElementById("object-name")
                .value = this._$name;

            document
                .getElementById("scene-name")
                .textContent = this._$name;

        }

    }

    /**
     * @return {string}
     * @public
     */
    get type ()
    {
        return this._$type;
    }

    /**
     * @param  {string} type
     * @return {void}
     * @public
     */
    set type (type)
    {
        this._$type = `${type}`;
    }

    /**
     * @return {string}
     * @public
     */
    get symbol ()
    {
        return this._$symbol;
    }

    /**
     * @param  {string} symbol
     * @return {void}
     * @public
     */
    set symbol (symbol)
    {
        this._$symbol = `${symbol}`;

        if (this.id) {
            document
                .getElementById(`library-symbol-name-${this.id}`)
                .textContent = `${symbol}`;
        }
    }
}
