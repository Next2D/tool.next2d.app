/**
 * @class
 */
class Character
{
    /**
     * @param {object} object
     *
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        this._$libraryId      = -1;
        this._$places         = new Map();
        this._$image          = null;
        this._$currentFrame   = 0;
        this._$currentPlace   = null;
        this._$screenX        = 0;
        this._$screenY        = 0;
        this._$offsetX        = 0;
        this._$offsetY        = 0;
        this._$name           = "";
        this._$tween          = new Map();
        this._$referencePoint = { "x": 0, "y": 0 };

        if (object) {
            this._$id           = object.id;
            this._$libraryId    = object.libraryId;
            this.places         = object.places;
            this._$name         = object.name || "";
            this._$startFrame   = object.startFrame;
            this._$endFrame     = object.endFrame;
            this.tween          = object.tween;
            this.referencePoint = object.referencePoint;
        } else {
            this._$id         = Util.$currentWorkSpace()._$characterId++;
            this._$startFrame = 1;
            this._$endFrame   = 0;
        }
    }

    /**
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
    }

    /**
     * @param {MouseEvent} event
     */
    showShapeColor (event)
    {
        Util.$controller.hideObjectSetting([
            "fill-color-setting"
        ]);

        const instance = Util
            .$currentWorkSpace()
            .getLibrary(this.libraryId);

        if (instance.type !== "shape") {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        instance.showShapeColor(this.getPlace(frame), event);
    }

    /**
     * @return {Character}
     * @public
     */
    clone ()
    {
        const character = new Character(this.toObject());
        character._$id  = Util.$currentWorkSpace()._$characterId++;
        return character;
    }

    /**
     * @param  {number} frame
     * @return {Character}
     * @public
     */
    copy (frame)
    {
        // clone
        const character      = this.clone();
        character.startFrame = frame;

        // clone place data
        character.setPlace(frame, this.clonePlace(this.startFrame, frame));

        return character;
    }

    /**
     * @param  {number} from_frame
     * @param  {number} to_frame
     * @return {object}
     * @public
     */
    clonePlace (from_frame, to_frame)
    {
        const place = this.getPlace(from_frame);

        const filters = [];
        const length = place.filter.length;
        for (let idx = 0; idx < length; ++idx) {
            filters.push(place.filter[idx].clone());
        }

        const clone = {
            "frame": to_frame,
            "matrix": place.matrix.slice(0),
            "colorTransform": place.colorTransform.slice(0),
            "blendMode": place.blendMode,
            "filter": filters,
            "depth": place.depth
        };

        if (place.loop) {

            // init
            clone.loop = {};

            // clone
            const keys = Object.keys(place.loop);
            for (let idx = 0; idx < keys.length; ++idx) {
                const name = keys[idx];
                clone.loop[name] = place.loop[name];
            }
        }

        return clone;
    }

    /**
     * @return {number}
     * @public
     */
    getTweenFrame ()
    {
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return 0;
        }

        const layerId = layerElement.dataset.layerId | 0;

        let frame = Util.$timelineFrame.currentFrame;
        while (frame > 1) {

            const element = document
                .getElementById(`${layerId}-${frame}`);

            if (element.classList.contains("key-frame")) {
                break;
            }

            --frame;
        }

        return frame;
    }

    /**
     * @return {object}
     * @public
     */
    getTween ()
    {
        return this.hasTween()
            ? this._$tween.get(this.getTweenFrame())
            : null;
    }

    /**
     * @param  {object} object
     * @return {void}
     * @public
     */
    setTween (object)
    {
        this._$tween.set(this.getTweenFrame(), object);
    }

    /**
     * @return {boolean}
     * @public
     */
    hasTween ()
    {
        return this._$tween.has(this.getTweenFrame());
    }

    /**
     * @param  {number} [frame=0]
     * @param  {boolean} [preview=false]
     * @return {object}
     * @public
     */
    getBounds (frame = 0, preview = false)
    {
        const workSpace = Util.$currentWorkSpace();
        const instance  = workSpace.getLibrary(this.libraryId);

        if (!frame) {
            frame = Util.$timelineFrame.currentFrame;
        }

        const place = this.getPlace(frame);
        const placeObject = {};

        const keys = Object.keys(place);
        for (let idx = 0; idx < keys.length; ++idx) {
            const name = keys[idx];
            placeObject[name] = place[name];
        }

        if (instance.type === "container") {

            placeObject.loop = Util.$getDefaultLoopConfig();

            if (place.loop) {
                const keys = Object.keys(place.loop);
                for (let idx = 0; idx < keys.length; ++idx) {
                    const name = keys[idx];
                    placeObject.loop[name] = place.loop[name];
                }
            }

            placeObject.placeFrame = place.frame;
            placeObject.startFrame = this.startFrame;
            placeObject.endFrame   = this.endFrame;
        }

        // cache
        const currentFrame = Util.$currentFrame;

        Util.$currentFrame = frame;
        const bounds = instance.getBounds(placeObject, preview);

        // reset
        Util.$currentFrame = currentFrame;

        return bounds;
    }

    /**
     * @return {number}
     * @public
     */
    get rotation ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        return Math.atan2(matrix[1], matrix[0]) * Util.$Rad2Deg;
    }

    /**
     * @param  {number} rotate
     * @return {void}
     * @public
     */
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
     * @return {number}
     * @public
     */
    get width ()
    {
        let frame = Util.$timelineFrame.currentFrame;

        const bounds = Util.$boundsMatrix(
            this.getBounds(),
            this.getPlace(frame).matrix
        );

        const width = +Math.abs(bounds.xMax - bounds.xMin);
        return width !== Infinity ? width : 0;
    }

    /**
     * @param  {number} width
     * @return {void}
     * @public
     */
    set width (width)
    {
        const bounds  = this.getBounds();
        const exWidth = Math.abs(bounds.xMax - bounds.xMin);
        this.scaleX   = width / exWidth;
    }

    /**
     * @return {number}
     * @public
     */
    get scaleX ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        return Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    }

    /**
     * @param  {number} scale_x
     * @return {void}
     * @public
     */
    set scaleX (scale_x)
    {
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
     * @return {number}
     * @public
     */
    get height ()
    {
        const frame  = Util.$timelineFrame.currentFrame;

        const bounds = Util.$boundsMatrix(
            this.getBounds(),
            this.getPlace(frame).matrix
        );

        const height = +Math.abs(bounds.yMax - bounds.yMin);
        return height !== Infinity ? height : 0;
    }

    /**
     * @param  {number} height
     * @return {void}
     * @public
     */
    set height (height)
    {
        const bounds   = this.getBounds();
        const exHeight = Math.abs(bounds.yMax - bounds.yMin);
        this.scaleY    = height / exHeight;
    }

    /**
     * @return {number}
     * @public
     */
    get scaleY ()
    {
        const frame = Util.$timelineFrame.currentFrame;

        const matrix = this.getPlace(frame).matrix;
        return Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
    }

    /**
     * @param  {number} scale_y
     * @return {void}
     * @public
     */
    set scaleY (scale_y)
    {
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
     * @return {number}
     * @public
     */
    get x ()
    {
        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        return place.matrix[4];
    }

    /**
     * @param  {number} x
     * @return {void}
     * @public
     */
    set x (x)
    {
        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        place.matrix[4] = x;
    }

    /**
     * @return {number}
     * @public
     */
    get y ()
    {
        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        return place.matrix[5];
    }

    /**
     * @param  {number} y
     * @return {void}
     * @public
     */
    set y (y)
    {
        const frame = Util.$timelineFrame.currentFrame;
        const place = this.getPlace(frame);
        place.matrix[5] = y;
    }

    /**
     * @return {HTMLImageElement}
     * @public
     */
    get image ()
    {
        if (!this._$image) {

            const workSpace = Util.$currentWorkSpace();
            const instance  = workSpace.getLibrary(this.libraryId);

            const frame = Util.$timelineFrame.currentFrame;

            const place = this.getPlace(frame);

            // reset
            Util.$currentFrame = frame;

            let keys = Object.keys(place);
            const placeObject = {};
            for (let idx = 0; idx < keys.length; ++idx) {
                const name = keys[idx];
                placeObject[name] = place[name];
            }

            // reset
            if (instance.type === "container") {

                // init
                placeObject.loop = Util.$getDefaultLoopConfig();
                placeObject.loop.placeFrame = place.frame;

                // setup
                placeObject.startFrame = this.startFrame;
                placeObject.endFrame   = this.endFrame;

                let loopConfig = place.loop;
                if (loopConfig) {

                    if (loopConfig.referenceFrame) {

                        loopConfig = this.getPlace(loopConfig.referenceFrame).loop;
                        placeObject.loop.placeFrame = loopConfig.referenceFrame;

                    } else {

                        if (loopConfig.type === Util.DEFAULT_LOOP) {

                            let prevPlace = place;
                            while (prevPlace.frame - 1 > 0) {

                                const prevFrame = prevPlace.frame - 1;
                                if (!this.hasPlace(prevFrame)) {
                                    break;
                                }

                                prevPlace = this.getPlace(prevFrame);

                                loopConfig = prevPlace.loop;
                                placeObject.loop.placeFrame = prevPlace.frame;
                                if (loopConfig.type !== Util.DEFAULT_LOOP) {
                                    break;
                                }
                            }
                        }

                    }

                    // clone
                    keys = Object.keys(loopConfig);
                    for (let idx = 0; idx < keys.length; ++idx) {
                        const name = keys[idx];
                        placeObject.loop[name] = loopConfig[name];
                    }
                }
            }

            const bounds = Util.$boundsMatrix(
                instance.getBounds(placeObject),
                place.matrix
            );

            // reset
            Util.$currentFrame = frame;

            const width  = +Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
            const height = +Math.ceil(Math.abs(bounds.yMax - bounds.yMin));
            switch (placeObject.blendMode) {

                case "alpha":
                case "erase":
                    return Util.$emptyImage;

                case "invert":
                    this._$image = instance.toImage(width, height,
                        {
                            "frame": frame,
                            "matrix": placeObject.matrix,
                            "colorTransform": [
                                0, 0, 0, placeObject.colorTransform[3],
                                0, 0, 0, placeObject.colorTransform[7]
                            ],
                            "blendMode": placeObject.blendMode,
                            "filter": placeObject.filter,
                            "loop": placeObject.loop
                        },
                        this.referencePoint
                    );
                    break;

                default:
                    this._$image = instance
                        .toImage(width, height, placeObject, this.referencePoint);
                    break;

            }

            // set blend mode
            switch (placeObject.blendMode) {

                case "add":
                    this._$image.style.mixBlendMode = "color-dodge";
                    break;

                case "subtract":
                    this._$image.style.filter = "invert(100%)";
                    this._$image.style.mixBlendMode = "multiply";
                    break;

                case "invert":
                    this._$image.style.filter = "invert(100%)";
                    this._$image.style.mixBlendMode = "difference";
                    break;

                case "hardlight":
                    this._$image.style.mixBlendMode = "hard-light";
                    break;

                case "alpha":
                case "erase":
                case "layer":
                    break;

                default:
                    this._$image.style.mixBlendMode = placeObject.blendMode;
                    break;

            }

            this._$screenX = this._$image._$tx;
            this._$screenY = this._$image._$ty;
            this._$offsetX = this._$image._$offsetX;
            this._$offsetY = this._$image._$offsetY;

            this._$image.style.position = "relative";
        }

        return this._$image;
    }

    /**
     * @return {number}
     * @public
     */
    get offsetX ()
    {
        return this._$offsetX;
    }

    /**
     * @return {number}
     * @public
     */
    get offsetY ()
    {
        return this._$offsetY;
    }

    /**
     * @return {number}
     * @public
     */
    get screenX ()
    {
        return this._$screenX;
    }

    /**
     * @param  {number} screen_x
     * @return {void}
     * @public
     */
    set screenX (screen_x)
    {
        this._$screenX = screen_x;
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get screenY ()
    {
        return this._$screenY;
    }

    /**
     * @param  {number} screen_y
     * @return {void}
     * @public
     */
    set screenY (screen_y)
    {
        this._$screenY = screen_y;
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get id ()
    {
        return this._$id;
    }

    /**
     * @return {number}
     * @public
     */
    get libraryId ()
    {
        return this._$libraryId;
    }

    /**
     * @param  {number} library_id
     * @return {void}
     * @public
     */
    set libraryId (library_id)
    {
        this._$libraryId = library_id | 0;
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
        name += "";
        name.replace(" ", "");
        this._$name = name.trim();
    }

    /**
     * @return {object}
     * @public
     */
    get referencePoint ()
    {
        return {
            "x": this._$referencePoint.x,
            "y": this._$referencePoint.y
        };
    }

    /**
     * @param {object} point
     * @public
     */
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
                object.value.custom = Util.$controller.createEasingObject();
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

        const places = [];
        for (let [frame, place] of this._$places) {

            place.frame = frame;

            const filters = [];
            for (let idx = 0; idx < place.filter.length; ++idx) {
                filters.push(place.filter[idx].toObject());
            }

            const object = {
                "frame": frame,
                "fixed": !!place.fixed,
                "depth": place.depth,
                "blendMode": place.blendMode,
                "filter": filters,
                "matrix": place.matrix.slice(0),
                "colorTransform": place.colorTransform.slice(0)
            };

            if (instance.type === "container") {

                object.loop = Util.$getDefaultLoopConfig();

                if (place.loop) {
                    object.loop = {
                        "type": place.loop.type,
                        "start": place.loop.start,
                        "end": place.loop.end
                    };

                    if (place.loop.referenceFrame) {
                        object.loop.referenceFrame = place.loop.referenceFrame;
                    }

                    if (place.loop.tweenFrame) {
                        object.loop.tweenFrame = place.loop.tweenFrame;
                    }
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
     * @public
     */
    getClonePlace (frame)
    {
        const place = this.getPlace(frame);

        const placeObject = {};

        const keys = Object.keys(place);
        for (let idx = 0; idx < keys.length; ++idx) {
            const name = keys[idx];
            placeObject[name] = place[name];
        }

        if (place.loop) {

            placeObject.loop = Util.$getDefaultLoopConfig();

            const keys = Object.keys(place.loop);
            for (let idx = 0; idx < keys.length; ++idx) {
                const name = keys[idx];
                placeObject.loop[name] = place.loop[name];
            }

            placeObject.placeFrame = place.frame;
            placeObject.startFrame = this.startFrame;
            placeObject.endFrame   = this.endFrame;
        }

        return placeObject;
    }

    /**
     * @param  {number} frame
     * @return {object}
     * @public
     */
    getPlace (frame)
    {
        if (this.hasPlace(frame)) {
            return this._$places.get(frame | 0);
        }

        const places = Array.from(this._$places);
        places.sort((a, b) =>
        {
            switch (true) {

                case a[0] > b[0]:
                    return 1;

                case a[0] < b[0]:
                    return -1;

                default:
                    return 0;

            }
        });

        while (places.length) {

            const placeFrame = places.pop()[0] | 0;

            if (frame > placeFrame) {
                return this._$places.get(placeFrame);
            }

        }
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
            places.set(keyFrame + frame, place);
        }

        // キーフレームの情報を上書き
        this._$places = places;

        // 開始位置と終了位置を移動
        this.startFrame += frame;
        this.endFrame   += frame;
    }

    /**
     * @param  {number} start_frame
     * @param  {number} end_frame
     * @return {Character}
     * @public
     */
    split (start_frame, end_frame)
    {
        const character = new Character();
        character._$id  = Util.$currentWorkSpace()._$characterId++;

        // params
        character._$libraryId  = this._$libraryId;
        character._$places     = new Map();
        character._$startFrame = start_frame;
        character._$endFrame   = end_frame;

        const removeFrames = [];
        for (let [frame, place] of this._$places) {

            if (start_frame > frame) {
                continue;
            }

            if (frame > end_frame) {
                continue;
            }

            removeFrames.push(frame);
            character._$places.set(frame, place);
        }

        // 分割したplace objectは削除
        for (let idx = 0; idx < removeFrames.length; ++idx) {
            this._$places.delete(removeFrames[idx]);
        }

        return character;
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "id":             this.id,
            "name":           this.name,
            "libraryId":      this.libraryId,
            "places":         this.places,
            "startFrame":     this.startFrame,
            "endFrame":       this.endFrame,
            "tween":          this.tween,
            "referencePoint": this.referencePoint
        };
    }
}
