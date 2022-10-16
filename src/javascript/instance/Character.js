/**
 * スクリーンに配置されたDisplayObjectクラス
 * DisplayObject class placed on the screen
 *
 * @class
 * @memberOf instance
 */
class Character
{
    /**
     * @param {object} [object=null]
     *
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        this._$libraryId      = -1;
        this._$layerId        = -1;
        this._$places         = new Map();
        this._$tween          = new Map();
        this._$context        = null;
        this._$image          = null;
        this._$currentFrame   = 0;
        this._$currentPlace   = null;
        this._$screenX        = 0;
        this._$screenY        = 0;
        this._$offsetX        = 0;
        this._$offsetY        = 0;
        this._$name           = "";
        this._$cachePlaces    = [];
        this._$referencePoint = { "x": 0, "y": 0 };

        if (object) {
            this._$id         = object.id;
            this._$libraryId  = object.libraryId;
            this._$name       = object.name || "";
            this._$startFrame = object.startFrame;
            this._$endFrame   = object.endFrame;
            this.places       = object.places || [];
            this.tween        = object.tween || [];
        } else {
            this._$id         = Util.$currentWorkSpace()._$characterId++;
            this._$startFrame = 1;
            this._$endFrame   = 2;
        }
    }

    /**
     * @description 選択したDisplayObjectの情報をコントローラーに表示する
     *              Display information on the selected DisplayObject in the controller
     *
     * @return {void}
     * @method
     * @public
     */
    showController ()
    {
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(this.libraryId);

        const frame = Util.$timelineFrame.currentFrame;

        instance.showController(this.getPlace(frame), this.name);

        // tweenの設定があれば表示
        const range = this.getRange(frame);
        if (this.hasTween(range.startFrame)) {

            // コントローラーエリアを表示
            Util.$controller.showObjectSetting([
                "ease-setting"
            ]);

            // 選択中の関数をselectにセット
            const tweenObject = this.getTween(range.startFrame);

            const children = document
                .getElementById("ease-select")
                .children;

            for (let idx = 0; idx < children.length; ++idx) {

                const node = children[idx];
                if (node.value !== tweenObject.method) {
                    continue;
                }

                node.selected = true;
                break;
            }

            // カスタム設定であればcanvasを表示
            if (tweenObject.method === "custom") {

                Util.$tweenController.showCustomArea();

            } else {

                Util.$tweenController.hideCustomArea();

            }
        }
    }

    /**
     * @description 選択時にコントローラーの不要な値は非表示に、変更可能な値は表示する
     *              Hides unwanted values of the controller when selected and shows values that can be changed
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    showShapeColor (event)
    {
        Util.$controller.hideObjectSetting([
            "fill-color-setting"
        ]);

        const instance = Util
            .$currentWorkSpace()
            .getLibrary(this.libraryId);

        if (instance.type !== InstanceType.SHAPE) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        instance.showShapeColor(this.getPlace(frame), event);
    }

    /**
     * @description Characterクラスを複製
     *              Duplicate Character class
     *
     * @return {Character}
     * @method
     * @public
     */
    clone ()
    {
        const character = new Character(
            JSON.parse(JSON.stringify(this.toObject()))
        );
        character._$layerId = -1;
        character._$id      = Util.$currentWorkSpace()._$characterId++;
        return character;
    }

    /**
     * @description タイムラインからDisplayObjectを削除
     *              Remove DisplayObject from Timeline
     *
     * @param  {Layer} layer
     * @return {void}
     * @method
     * @public
     */
    remove (layer)
    {
        if (this._$places.size === 1) {

            layer.deleteCharacter(this.id);

        } else {

            const range = this.getRange(
                Util.$timelineFrame.currentFrame
            );

            switch (true) {

                case range.startFrame === this.startFrame:
                    this._$places.delete(this.startFrame);
                    this.startFrame = range.endFrame;
                    break;

                case range.endFrame === this.endFrame:
                    this._$places.delete(range.startFrame);
                    this.endFrame = range.startFrame;
                    break;

                default:
                    {
                        const character = this.split(
                            layer, range.startFrame, range.endFrame
                        );

                        if (character._$tween.size) {
                            Util
                                .$tweenController
                                .clearPointer();
                        }
                    }
                    break;

            }

            // tween情報を削除
            if (this._$tween.has(range.startFrame)) {

                this._$tween.delete(range.startFrame);

                for (let keyFrame = range.startFrame; keyFrame < range.endFrame; ++keyFrame) {
                    if (!this._$places.has(keyFrame)) {
                        continue;
                    }
                    this._$places.delete(keyFrame);
                }

                Util
                    .$tweenController
                    .clearPointer();
            }

        }
    }

    /**
     * @description tweenの座標を再計算してポインターを再配置
     *              Recalculate tween coordinates and reposition pointer
     *
     * @param {number} frame
     * @method
     * @public
     */
    relocationTween (frame)
    {
        if (!this._$tween.size) {
            return ;
        }

        const range = this.getRange(frame);
        if (this.hasTween(range.startFrame)) {

            // 変更したフレームにキーフレームがなければ自動的に追加
            // 最後のフレームは対象外
            if (this.endFrame - 1 > frame && !this.hasTween(frame)) {
                Util
                    .$timelineTool
                    .executeTimelineKeyAdd();
            }

            Util
                .$tweenController
                .relocationPlace(this, range.startFrame);

            Util
                .$tweenController
                .clearPointer()
                .relocationPointer();
        }
    }

    /**
     * @description 指定したフレームをキーフレームの開始・終了のフレームを返す
     *              Returns the specified frame as the start and end frame of the keyframe
     *
     * @param  {number} frame
     * @return {object}
     * @method
     * @public
     */
    getRange (frame)
    {
        if (this._$places.size === 1) {
            return {
                "startFrame": this.startFrame,
                "endFrame": this.endFrame
            };
        }

        const places = Array.from(this._$places.keys());

        // 降順
        places.sort((a, b) =>
        {
            switch (true) {

                case a > b:
                    return 1;

                case a < b:
                    return -1;

                default:
                    return 0;

            }
        });

        let prevFrame = 0;
        while (places.length) {

            const placeFrame = places.pop() | 0;

            if (frame >= placeFrame) {
                const place = this.getPlace(placeFrame);
                if (place.tweenFrame) {
                    const tweenObject = this.getTween(place.tweenFrame);
                    return {
                        "startFrame": tweenObject.startFrame,
                        "endFrame": tweenObject.endFrame
                    };
                }

                return {
                    "startFrame": placeFrame,
                    "endFrame": prevFrame ? prevFrame : this.endFrame
                };
            }

            prevFrame = placeFrame;
        }

        return {
            "startFrame": this.startFrame,
            "endFrame": this.endFrame
        };
    }

    /**
     * @description tweenオブジェクトを複製
     *              Duplicate tween object
     *
     * @param  {number} frame
     * @return {object}
     * @method
     * @public
     */
    getCloneTween (frame)
    {
        return JSON.parse(JSON.stringify(this.getTween(frame)));
    }

    /**
     * @description キーフレームに設定したtweenの設定objectを返す
     *              Returns the tween setting object set to the keyframe
     *
     * @param  {number} frame
     * @return {object}
     * @method
     * @public
     */
    getTween (frame)
    {
        return this.hasTween(frame)
            ? this._$tween.get(frame)
            : null;
    }

    /**
     * @description 指定のキーフレームにtweenの設定objectを設定する
     *              Set tween setting object to specified keyframe
     *
     * @param  {number} frame
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    setTween (frame, object)
    {
        this._$tween.set(frame, object);
    }

    /**
     * @description 指定のキーフレームにtweenの設定objectが設定されているかを判定
     *              Determines if a tween setting object is set for a given keyframe
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    hasTween (frame)
    {
        return this._$tween.has(frame);
    }

    /**
     * @description 指定のキーフレームのtweenの設定objectを削除
     *              Delete tween setting object for specified keyframe
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    deleteTween (frame)
    {
        return this._$tween.delete(frame);
    }

    /**
     * @description 表示領域(バウンディングボックス)のObjectを返す
     *              Returns the Object of the display area (bounding box)
     *
     * @return {object}
     * @method
     * @public
     */
    getBounds ()
    {
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(this.libraryId);

        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        const range = place.loop && place.loop.type === 5
            ? { "startFrame": this.startFrame, "endFrame": this.endFrame }
            : this.getRange(frame);

        // cache
        const currentFrame = Util.$currentFrame;
        Util.$currentFrame = frame;

        const bounds = instance.getBounds(place.matrix, place, range);

        // reset
        Util.$currentFrame = currentFrame;

        return bounds;
    }

    /**
     * @description DisplayObject インスタンスの元の位置からの回転角を度単位で示します。
     *              Indicates the rotation of the DisplayObject instance,
     *              in degrees, from its original orientation.
     *
     * @member {number}
     * @public
     */
    get rotation ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        return Math.atan2(matrix[1], matrix[0]) * Util.$Rad2Deg;
    }
    set rotation (rotate)
    {
        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        let radianX  = Math.atan2(matrix[1], matrix[0]);
        let radianY  = Math.atan2(-matrix[2], matrix[3]);

        const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        const radian = rotate * Util.$Deg2Rad;
        radianY      = radianY + radian - radianX;
        radianX      = radian;

        matrix[0] = xScale  * Math.cos(radianX);
        matrix[1] = xScale  * Math.sin(radianX);
        matrix[2] = -yScale * Math.sin(radianY);
        matrix[3] = yScale  * Math.cos(radianY);
    }

    /**
     * @description 表示オブジェクトの幅を示します（ピクセル単位）。
     *              Indicates the width of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get width ()
    {
        const bounds = this.getBounds();
        const width  = +Math.abs(bounds.xMax - bounds.xMin);
        return width !== Infinity ? width : 0;
    }
    set width (width)
    {
        const bounds  = this.getBounds();
        const exWidth = Math.abs(bounds.xMax - bounds.xMin);
        this.scaleX   = width / exWidth;
    }

    /**
     * @description 基準点から適用されるオブジェクトの水平スケール（パーセンテージ）を示します。
     *              Indicates the horizontal scale (percentage)
     *              of the object as applied from the registration point.
     *
     * @member {number}
     * @public
     */
    get scaleX ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        return Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    }
    set scaleX (scale_x)
    {
        scale_x = Util.$toFixed4(scale_x);

        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        if (matrix[1]) {

            const radianX = Math.atan2(matrix[1], matrix[0]);

            matrix[1] = scale_x * Math.sin(radianX);
            if (matrix[1] === 1 || matrix[1] === -1) {
                matrix[0] = 0;
            } else {
                matrix[0] = scale_x * Math.cos(radianX);
            }

        } else {

            matrix[0] = scale_x;

        }

    }

    /**
     * @description 表示オブジェクトの高さを示します（ピクセル単位）。
     *              Indicates the height of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get height ()
    {
        const bounds = this.getBounds();
        const height = +Math.abs(bounds.yMax - bounds.yMin);
        return height !== Infinity ? height : 0;
    }
    set height (height)
    {
        const bounds   = this.getBounds();
        const exHeight = Math.abs(bounds.yMax - bounds.yMin);
        this.scaleY    = height / exHeight;
    }

    /**
     * @description 基準点から適用されるオブジェクトの垂直スケール（パーセンテージ）を示します。
     *              IIndicates the vertical scale (percentage)
     *              of an object as applied from the registration point.
     *
     * @member {number}
     * @public
     */
    get scaleY ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        return Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
    }
    set scaleY (scale_y)
    {
        scale_y = Util.$toFixed4(scale_y);

        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        if (matrix[2]) {

            const radianY = Math.atan2(-matrix[2], matrix[3]);
            matrix[2] = -scale_y * Math.sin(radianY);
            if (matrix[2] === 1 || matrix[2] === -1) {
                matrix[3] = 0;
            } else {
                matrix[3] = scale_y * Math.cos(radianY);
            }

        } else {

            matrix[3] = scale_y;

        }
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの x 座標を示します。
     *              Indicates the x coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get x ()
    {
        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        return place.matrix[4];
    }
    set x (x)
    {
        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        place.matrix[4] = x;

        const bounds = this.getBounds();
        this.screenX = bounds.xMin;

        const element = document
            .getElementById(`character-${this.id}`);

        if (element) {
            element.style.left = `${Util.$offsetLeft + bounds.xMin * Util.$zoomScale}px`;
        }
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの y 座標を示します。
     *              Indicates the y coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get y ()
    {
        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        return place.matrix[5];
    }
    set y (y)
    {
        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        place.matrix[5] = y;

        const bounds = this.getBounds();
        this.screenY = bounds.yMin;

        const element = document
            .getElementById(`character-${this.id}`);

        if (element) {
            element.style.top = `${Util.$offsetTop + bounds.yMin * Util.$zoomScale}px`;
        }
    }

    /**
     * @description 表示用のHTMLCanvasElementクラスを生成
     *              Generate HTMLCanvasElement class for display
     *
     * @param  {HTMLCanvasElement} canvas
     * @return {HTMLCanvasElement}
     * @method
     * @public
     */
    draw (canvas)
    {
        if (this._$context) {
            if (canvas instanceof HTMLCanvasElement) {
                Util.$canvases.push(canvas);
            }
            return this._$context.canvas;
        }

        const workSpace = Util.$currentWorkSpace();
        const instance  = workSpace.getLibrary(this.libraryId);

        const frame = Util.$timelineFrame.currentFrame;

        const place = this.getPlace(frame);
        const range = place.loop && place.loop.type === 5
            ? { "startFrame": this.startFrame, "endFrame": this.endFrame }
            : this.getRange(frame);

        // reset
        Util.$currentFrame = frame;

        const bounds = instance.getBounds(place.matrix, place, range);
        const width  = +Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
        const height = +Math.ceil(Math.abs(bounds.yMax - bounds.yMin));

        let context = null;
        switch (place.blendMode) {

            case "invert":
                context = instance.draw(canvas, width, height,
                    {
                        "frame": place.frame,
                        "matrix": place.matrix,
                        "colorTransform": [
                            0, 0, 0, place.colorTransform[3],
                            0, 0, 0, place.colorTransform[7]
                        ],
                        "blendMode": place.blendMode,
                        "filter": place.filter,
                        "tweenFrame": place.tweenFrame,
                        "loop": place.loop
                    },
                    range
                );
                break;

            case "alpha":
            case "erase":
                {
                    const bounds = this.getBounds(place.matrix, place, range);
                    canvas._$tx      = bounds.xMin;
                    canvas._$ty      = bounds.yMin;
                    canvas._$offsetX = 0;
                    canvas._$offsetY = 0;
                    canvas._$width   = 0;
                    canvas._$height  = 0;
                    canvas.draggable = false;

                    canvas.width = canvas.height = 0;
                    context = canvas.getContext("2d");
                }
                break;

            default:
                context = instance.draw(canvas, width, height, place, range);
                break;

        }

        this._$context = context;

        // set blend mode
        switch (place.blendMode) {

            case "normal":
                break;

            case "add":
                canvas.style.mixBlendMode = "color-dodge";
                break;

            case "subtract":
                canvas.style.filter = "invert(100%)";
                canvas.style.mixBlendMode = "multiply";
                break;

            case "invert":
                canvas.style.filter = "invert(100%)";
                canvas.style.mixBlendMode = "difference";
                break;

            case "hardlight":
                canvas.style.mixBlendMode = "hard-light";
                break;

            case "alpha":
            case "erase":
            case "layer":
                break;

            default:
                canvas.style.mixBlendMode = place.blendMode;
                break;

        }

        this._$screenX = canvas._$tx;
        this._$screenY = canvas._$ty;
        this._$offsetX = canvas._$offsetX;
        this._$offsetY = canvas._$offsetY;

        return canvas;
    }

    /**
     * @description フィルター適用で移動したx座標の値
     *              Value of x-coordinate moved by applying filter
     *
     * @member {number}
     * @readonly
     * @public
     */
    get offsetX ()
    {
        return this._$offsetX;
    }

    /**
     * @description フィルター適用で移動したy座標の値
     *              Value of y-coordinate moved by applying filter
     *
     * @member {number}
     * @readonly
     * @public
     */
    get offsetY ()
    {
        return this._$offsetY;
    }

    /**
     * @description インスタンス内で移動したx座標の値
     *              Value of x-coordinate moved within the instance
     *
     * @member {number}
     * @public
     */
    get screenX ()
    {
        return this._$screenX;
    }
    set screenX (screen_x)
    {
        this._$screenX = screen_x;
    }

    /**
     * @description インスタンス内で移動したy座標の値
     *              Value of x-coordinate moved within the instance
     *
     * @member {number}
     * @public
     */
    get screenY ()
    {
        return this._$screenY;
    }
    set screenY (screen_y)
    {
        this._$screenY = screen_y;
    }

    /**
     * @description DisplayObjectのid、ワークスペース内ではユニークの値
     *              DisplayObject id, unique value in the workspace
     *
     * @member {number}
     * @readonly
     * @public
     */
    get id ()
    {
        return this._$id;
    }

    /**
     * @description コントローラーに読み込まれたアイテムID
     *              Item ID loaded in controller
     *
     * @member {number}
     * @public
     */
    get libraryId ()
    {
        return this._$libraryId;
    }
    set libraryId (library_id)
    {
        this._$libraryId = library_id | 0;
    }

    /**
     * @description MovieClip内で有効なアクセス名
     *              Valid access name in MovieClip
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
        name += "";
        name.replace(" ", "");
        this._$name = name.trim();
    }

    /**
     * @description 中心点の座標
     *              Coordinates of the center point
     *
     * @member {object}
     * @public
     */
    get referencePoint ()
    {
        return {
            "x": this._$referencePoint.x,
            "y": this._$referencePoint.y
        };
    }
    set referencePoint (point)
    {
        if (point) {
            this._$referencePoint.x = point.x;
            this._$referencePoint.y = point.y;
        }
    }

    /**
     * @return {array}
     * @public
     */
    get tween ()
    {
        const values = [];
        for (let [frame, value] of this._$tween) {
            values.push({
                "frame": frame,
                "value": value
            });
        }
        return values;
    }

    /**
     * @param  {array} values
     * @return {void}
     * @public
     */
    set tween (values)
    {
        for (let idx = 0; idx < values.length; ++idx) {
            const object = values[idx];
            if (!object.value.custom) {
                object.value.custom = Util
                    .$tweenController
                    .createEasingObject();
            }
            this._$tween.set(object.frame | 0, object.value);
        }
    }

    /**
     * @return {array}
     * @public
     */
    get places ()
    {
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(this.libraryId);

        if (!instance) {
            return [];
        }

        const places = [];
        for (let [frame, place] of this._$places) {

            place.frame = frame;

            const filters = [];
            for (let idx = 0; idx < place.filter.length; ++idx) {
                filters.push(place.filter[idx].toObject());
            }

            const object = {
                "frame": frame,
                "depth": place.depth,
                "blendMode": place.blendMode,
                "filter": filters,
                "matrix": place.matrix.slice(0),
                "colorTransform": place.colorTransform.slice(0),
                "point": place.point
            };

            if (place.tweenFrame) {
                object.tweenFrame = place.tweenFrame;
            }

            if (instance.type === InstanceType.MOVIE_CLIP) {

                if (place.loop) {

                    object.loop = {
                        "type": place.loop.type,
                        "start": place.loop.start,
                        "end": place.loop.end
                    };

                } else {

                    object.loop = Util.$getDefaultLoopConfig();

                }
            }

            places.push(object);
        }
        return places;
    }

    /**
     * @param  {array} places
     * @return {void}
     * @public
     */
    set places (places)
    {
        for (let idx = 0; idx < places.length; ++idx) {

            const place = places[idx];

            const filters = [];
            for (let idx = 0; place.filter.length > idx; ++idx) {
                const object = place.filter[idx];
                filters.push(new Util.$filterClasses[object.name](object));
            }

            place.filter = null;
            place.filter = filters;

            if (!place.loop) {
                place.loop = Util.$getDefaultLoopConfig();
            }

            this._$places.set(place.frame | 0, place);
        }
    }

    /**
     * @param  {number} frame
     * @return {object}
     * @method
     * @public
     */
    getClonePlace (frame)
    {
        return JSON.parse(JSON.stringify(this.getPlace(frame)));
    }

    /**
     * @param  {number} frame
     * @return {object}
     * @method
     * @public
     */
    getPlace (frame)
    {
        if (this._$places.size === 1) {
            return this._$places.get(this.startFrame);
        }

        if (this.hasPlace(frame)) {
            return this._$places.get(frame | 0);
        }

        return this._$places.get(
            this.getNearPlaceFrame(frame | 0)
        );
    }

    /**
     * @description 指定したフレームより若く一番近いキーフレーム番号を返す
     *
     * @param  {number} frame
     * @return {number}
     * @method
     * @public
     */
    getNearPlaceFrame (frame)
    {
        // 再生中は内部キャッシュを利用して高速化
        if (!Util.$timelinePlayer._$stopFlag) {

            // キャッシュがなければキャッシュ
            if (!this._$cachePlaces.length) {
                // 降順
                this._$cachePlaces = Array.from(this._$places.keys());
                this._$cachePlaces.sort((a, b) =>
                {
                    switch (true) {

                        case a > b:
                            return -1;

                        case a < b:
                            return 1;

                        default:
                            return 0;

                    }
                });
            }

            let idx = 0;
            while (this._$cachePlaces.length > idx) {

                const placeFrame = this._$cachePlaces[idx++] | 0;

                if (frame > placeFrame) {
                    return placeFrame;
                }

            }

            return 1;
        }

        // 再生が終了してキャッシュがあれば削除
        if (this._$cachePlaces.length) {
            this._$cachePlaces.length = 0;
        }

        // 昇順
        const places = Array.from(this._$places.keys());
        places.sort((a, b) =>
        {
            switch (true) {

                case a > b:
                    return 1;

                case a < b:
                    return -1;

                default:
                    return 0;

            }
        });

        while (places.length) {

            const placeFrame = places.pop() | 0;

            if (frame > placeFrame) {
                return placeFrame;
            }

        }

        return 1;
    }

    /**
     * @param  {number} frame
     * @param  {object} place
     * @return {void}
     * @public
     */
    setPlace (frame, place)
    {
        place.frame = frame | 0;
        this._$places.set(frame | 0, place);
    }

    /**
     * @param  {number} frame
     * @return {boolean}
     * @public
     */
    hasPlace (frame)
    {
        return this._$places.has(frame | 0);
    }

    /**
     * @param  {number} frame
     * @return {void}
     * @public
     */
    deletePlace (frame)
    {
        this._$places.delete(frame | 0);
    }

    /**
     * @return {number}
     * @public
     */
    get startFrame ()
    {
        return this._$startFrame;
    }

    /**
     * @param  {number} start_frame
     * @return {void}
     * @public
     */
    set startFrame (start_frame)
    {
        this._$startFrame = start_frame | 0;
    }

    /**
     * @return {number}
     * @public
     */
    get endFrame ()
    {
        return this._$endFrame;
    }

    /**
     * @param  {number} end_frame
     * @return {void}
     * @public
     */
    set endFrame (end_frame)
    {
        this._$endFrame = end_frame | 0;
    }

    /**
     * @description tweenのplace objectを構築
     *
     * @param  {number} start_frame
     * @param  {number} end_frame
     * @return {void}
     * @method
     * @public
     */
    updateTweenPlace (start_frame, end_frame)
    {
        for (let frame = start_frame; frame < end_frame; ++frame) {

            const place = this.hasPlace(frame)
                ? this.getPlace(frame)
                : this.getClonePlace(end_frame);

            place.tweenFrame = start_frame;

            this.setPlace(frame, place);
        }
    }

    /**
     * @description ブレンドモード追加時にレンジ内のplace objectを更新
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    updateTweenBlend (frame)
    {
        if (!this._$tween.size) {
            return ;
        }

        const range    = this.getRange(frame);
        const keyPlace = this.getPlace(range.startFrame);

        for (let frame = range.startFrame; frame < range.endFrame; ++frame) {

            if (!this.hasPlace(frame)) {

                const clonePlace = this.getClonePlace(range.startFrame);
                clonePlace.blendMode = keyPlace.blendMode;
                this.setPlace(frame, clonePlace);

            } else {

                this
                    .getPlace(frame)
                    .blendMode = keyPlace.blendMode;

            }
        }
    }

    /**
     * @description filter追加時にレンジ内のplace objectにfilterを追加
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    updateTweenFilter (frame)
    {
        if (!this._$tween.size) {
            return ;
        }

        const range    = this.getRange(frame);
        const keyPlace = this.getPlace(range.startFrame);

        for (let frame = range.startFrame; frame < range.endFrame; ++frame) {

            const filters = [];
            const length = keyPlace.filter.length;
            for (let idx = 0; idx < length; ++idx) {
                filters.push(keyPlace.filter[idx].clone());
            }

            if (!this.hasPlace(frame)) {

                const clonePlace  = this.getClonePlace(range.startFrame);
                clonePlace.filter = filters;
                this.setPlace(frame, clonePlace);

            } else {

                this
                    .getPlace(frame)
                    .filter = filters;

            }

        }
    }

    /**
     * @description 指定フレームに移動
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    move (frame)
    {
        const places = new Map();
        for (const [keyFrame, place] of this._$places) {

            place.frame = keyFrame + frame;

            // tweenの情報があればtweenも移動
            if (place.tweenFrame) {
                place.tweenFrame += frame;
            }

            places.set(place.frame, place);
        }

        // キーフレームの情報を上書き
        this._$places = places;

        if (this._$tween.size) {

            const tween = new Map();
            for (const [keyFrame, tweenObject] of this._$tween) {
                tweenObject.startFrame += frame;
                tweenObject.endFrame   += frame;
                tween.set(keyFrame + frame, tweenObject);
            }

            // tweenの情報を上書き
            this._$tween = tween;
        }

        // 開始位置と終了位置を移動
        this.startFrame += frame;
        this.endFrame   += frame;
    }

    /**
     * @description DisplayObjectを指定フレームで分割
     *
     * @param  {Layer} layer
     * @param  {number} start_frame
     * @param  {number} end_frame
     * @return {Character}
     * @method
     * @public
     */
    split (layer, start_frame, end_frame)
    {
        // 開始と終了位置が一致したらLayerから削除
        if (start_frame === this.startFrame
            && end_frame === this.endFrame
        ) {
            layer.deleteCharacter(this.id);
            return this;
        }

        // 開始位置より先のフレームを指定した場合は分割
        if (start_frame > this.startFrame) {

            // 分離用のobject
            const character = new Character();
            character._$libraryId  = this._$libraryId;
            character._$startFrame = this.startFrame;
            character._$endFrame   = start_frame;

            // object placeを分割して再登録
            const places = new Map();
            for (const [keyFrame, place] of this._$places) {

                if (start_frame > keyFrame) {

                    character.setPlace(keyFrame, place);

                } else {

                    places.set(keyFrame, place);

                }
            }

            const tweenMap = new Map();
            for (const [keyFrame, tween] of this._$tween) {

                if (start_frame > keyFrame) {

                    character.setTween(keyFrame, tween);

                } else {

                    tweenMap.set(keyFrame, tween);

                }

            }

            // レイヤーに設置
            layer.addCharacter(character);

            // 分割したDisplayObjectの情報を更新
            this._$tween      = tweenMap;
            this._$places     = places;
            this._$startFrame = start_frame;
        }

        // 返却用のDisplayObject
        const character = new Character();
        character._$libraryId  = this._$libraryId;
        character._$startFrame = start_frame;
        character._$endFrame   = end_frame;

        const removeFrames = [];
        for (const [keyFrame, place] of this._$places) {

            if (start_frame > keyFrame) {
                continue;
            }

            if (keyFrame >= end_frame) {
                continue;
            }

            removeFrames.push(keyFrame);
            character._$places.set(keyFrame, place);
        }

        // 分割したplace objectは削除
        for (let idx = 0; idx < removeFrames.length; ++idx) {
            this._$places.delete(removeFrames[idx]);
        }

        // 初期化
        removeFrames.length = 0;
        for (const [keyFrame, tween] of this._$tween) {

            if (start_frame > keyFrame) {
                continue;
            }

            if (keyFrame >= end_frame) {
                continue;
            }

            removeFrames.push(keyFrame);
            character._$tween.set(keyFrame, tween);
        }

        // 分割したtween objectは削除
        for (let idx = 0; idx < removeFrames.length; ++idx) {
            this._$tween.delete(removeFrames[idx]);
        }

        // キーフレームがなければ削除
        if (!this._$places.size) {

            layer.deleteCharacter(this.id);

        } else {

            // キーフレームを配列変換
            const keys = Array.from(this._$places.keys());

            // 昇順に並び替え
            if (this._$places.size > 1) {
                keys.sort((a, b) =>
                {
                    switch (true) {

                        case a > b:
                            return 1;

                        case a < b:
                            return -1;

                        default:
                            return 0;

                    }
                });
            }

            this._$startFrame = keys[0] | 0;
        }

        return character;
    }

    /**
     * @return {object}
     * @method
     * @public
     */
    toObject ()
    {
        return {
            "id":         this.id,
            "name":       this.name,
            "libraryId":  this.libraryId,
            "places":     this.places,
            "startFrame": this.startFrame,
            "endFrame":   this.endFrame,
            "tween":      this.tween
        };
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    dispose ()
    {
        if (!this._$context) {
            return ;
        }

        Util.$poolCanvas(this._$context);
        this._$context = null;
    }
}
