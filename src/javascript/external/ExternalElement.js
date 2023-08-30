/**
 * @class
 * @memberOf external
 */
class ExternalElement
{
    /**
     * @param {Character} character
     * @param {ExternalFrame} parent
     * @constructor
     * @public
     */
    constructor (character, parent)
    {
        /**
         * @type {Character}
         * @private
         */
        this._$character = character;

        /**
         * @type {ExternalFrame}
         * @private
         */
        this._$parent = parent;
    }

    /**
     * @return {external.ExternalDocument}
     */
    get document ()
    {
        return this._$parent._$parent._$parent._$document;
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get elementType ()
    {
        const workSpace = this.document._$workSpace;

        const instance = workSpace.getLibrary(
            this._$character.libraryId
        );

        switch (instance.type) {

            case Instance.SHAPE:
                return "shape";

            case Instance.TEXT:
                return "text";

            default:
                return "instance";

        }

    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get instanceType ()
    {
        const workSpace = this.document._$workSpace;;

        const instance = workSpace.getLibrary(
            this._$character.libraryId
        );

        switch (instance.type) {

            case InstanceType.BITMAP:
                return "bitmap";

            case InstanceType.VIDEO:
                return "video";

            case InstanceType.SHAPE:
                if (instance.inBitmap) {
                    return "bitmap";
                }
                return "shape";

            default:
                return "symbol";

        }
    }

    /**
     * @member {string}
     * @public
     */
    get colorMode ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        if (place.colorTransform[0] !== 1
            || place.colorTransform[1] !== 1
            || place.colorTransform[2] !== 1
            || place.colorTransform[4] !== 0
            || place.colorTransform[5] !== 0
            || place.colorTransform[6] !== 0
            || place.colorTransform[7] !== 0
        ) {
            return "advanced";
        }

        if (place.colorTransform[3] !== 1) {
            return "alpha";
        }

        return "none";
    }

    /**
     * @member {number}
     * @public
     */
    get colorRedPercent ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.colorTransform[0] * 100;
    }

    /**
     * @member {number}
     * @public
     */
    get colorGreenPercent ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.colorTransform[1] * 100;
    }

    /**
     * @member {number}
     * @public
     */
    get colorBluePercent ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.colorTransform[2] * 100;
    }

    /**
     * @member {number}
     * @public
     */
    get colorAlphaPercent ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.colorTransform[3] * 100;
    }

    /**
     * @member {number}
     * @public
     */
    get colorRedAmount ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.colorTransform[4];
    }

    /**
     * @member {number}
     * @public
     */
    get colorGreenAmount ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.colorTransform[5];
    }

    /**
     * @member {number}
     * @public
     */
    get colorBlueAmount ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.colorTransform[6];
    }

    /**
     * @member {number}
     * @public
     */
    get colorAlphaAmount ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.colorTransform[7];
    }

    /**
     * @member {string}
     * @public
     */
    get blendMode ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.blendMode;
    }

    /**
     * @member {Matrix}
     * @public
     */
    get matrix ()
    {
        const { Matrix } = next2d.geom;
        const place = this._$character.getPlace(this._$parent._$frame);

        const workSpace = this.document._$workSpace;
        const instance = workSpace.getLibrary(
            this._$character.libraryId
        );

        let matrix = place.matrix.slice();
        if (instance.type === InstanceType.SHAPE && instance.inBitmap) {
            const bitmapMatrix = instance._$recodes[instance._$recodes.length - 3];
            if (bitmapMatrix) {
                const a00 = matrix[0];
                const a01 = matrix[1];
                const a10 = matrix[2];
                const a11 = matrix[3];
                const a20 = matrix[4];
                const a21 = matrix[5];

                matrix[0] = bitmapMatrix[0] * a00 + bitmapMatrix[1] * a10;
                matrix[1] = bitmapMatrix[0] * a01 + bitmapMatrix[1] * a11;
                matrix[2] = bitmapMatrix[2] * a00 + bitmapMatrix[3] * a10;
                matrix[3] = bitmapMatrix[2] * a01 + bitmapMatrix[3] * a11;
                matrix[4] = bitmapMatrix[4] * a00 + bitmapMatrix[5] * a10 + a20;
                matrix[5] = bitmapMatrix[4] * a01 + bitmapMatrix[5] * a11 + a21;
            }
        }

        return new Matrix(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );
    }

    /**
     * @member {number}
     * @public
     */
    get x ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.matrix[4];
    }
    set x (x)
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        place.matrix[4] = x;

        const workSpace = this.document._$workSpace;

        const instance  = workSpace.getLibrary(
            this._$character.libraryId
        );

        let keys = Object.keys(place);
        const placeObject = {};
        for (let idx = 0; idx < keys.length; ++idx) {
            const name = keys[idx];
            placeObject[name] = place[name];
        }

        placeObject.loop = Util.$getDefaultLoopConfig();

        // setup
        placeObject.startFrame = this._$character.startFrame;
        placeObject.endFrame   = this._$character.endFrame;

        const bounds = Util.$boundsMatrix(
            instance.getBounds(placeObject),
            placeObject.matrix
        );

        const tx = Util.$offsetLeft + bounds.xMin * Util.$zoomScale;
        this._$character._$screenX = tx;
        document
            .getElementById(`character-${this._$character.id}`)
            .style.left = `${tx}px`;
    }

    /**
     * @member {number}
     * @public
     */
    get y ()
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        return place.matrix[5];
    }
    set y (y)
    {
        const place = this._$character.getPlace(this._$parent._$frame);
        place.matrix[5] = y;

        const workSpace = this.document._$workSpace;;

        const instance  = workSpace.getLibrary(
            this._$character.libraryId
        );

        let keys = Object.keys(place);
        const placeObject = {};
        for (let idx = 0; idx < keys.length; ++idx) {
            const name = keys[idx];
            placeObject[name] = place[name];
        }

        placeObject.loop = Util.$getDefaultLoopConfig();

        // setup
        placeObject.startFrame = this._$character.startFrame;
        placeObject.endFrame   = this._$character.endFrame;

        const bounds = Util.$boundsMatrix(
            instance.getBounds(placeObject),
            placeObject.matrix
        );

        const ty = Util.$offsetTop + bounds.yMin * Util.$zoomScale;
        this._$character._$screenY = ty;
        document
            .getElementById(`character-${this._$character.id}`)
            .style.top = `${ty}px`;
    }

    /**
     * @return {ExternalItem}
     * @readonly
     * @public
     */
    get libraryItem ()
    {
        const externalDocument = this.document;

        const workSpace = externalDocument._$workSpace;

        const instance = workSpace.getLibrary(
            this._$character.libraryId
        );

        switch (instance.type) {

            case InstanceType.MOVIE_CLIP:
                return new ExternalSymbolItem(
                    instance, externalDocument
                );

            case InstanceType.SHAPE:
                if (instance.inBitmap) {
                    return new ExternalBitmapItem(instance, externalDocument);
                }
                return new ExternalItem(instance, externalDocument);

            case InstanceType.BITMAP:
                return new ExternalBitmapItem(instance, externalDocument);

            case InstanceType.SOUND:
                return new ExternalSoundItem(instance, externalDocument);

            default:
                return new ExternalItem(instance, externalDocument);

        }
    }

    /**
     * @member {string}
     * @public
     */
    get loop ()
    {
        const workSpace = this.document._$workSpace;

        const instance = workSpace.getLibrary(
            this._$character.libraryId
        );

        if (instance.type !== InstanceType.MOVIE_CLIP) {
            return "";
        }

        const place = this._$character.getPlace(this._$parent._$frame);
        if (!place.loop) {
            return "loop";
        }

        switch (place.loop.type) {

            case 1:
            case 3:
                return "play once";

            case 2:
                return "single frame";

            default:
                return "loop";

        }
    }
    set loop (loop_type)
    {
        const workSpace = this.document._$workSpace;

        const instance = workSpace.getLibrary(
            this._$character.libraryId
        );

        if (instance.type !== InstanceType.MOVIE_CLIP) {
            return ;
        }

        const place = this
            ._$character
            .getPlace(this._$parent._$frame);

        switch (loop_type) {

            case "loop":
                place.loop.type = LoopController.REPEAT;
                break;

            case "play once":
                place.loop.type = LoopController.NO_REPEAT;
                break;

            case "single frame":
                place.loop.type = LoopController.FIXED_ONE;
                break;

            default:
                place.loop.type = LoopController.DEFAULT;
                break;

        }
    }

    /**
     * @member {number}
     * @public
     */
    get firstFrame ()
    {
        return this._$character.startFrame - 1;
    }

    /**
     * @member {string}
     * @public
     */
    get symbolType ()
    {
        const workSpace = this.document._$workSpace;

        const instance = workSpace.getLibrary(
            this._$character.libraryId
        );

        return instance.type === InstanceType.MOVIE_CLIP ? "movie clip" : "";
    }
    set symbolType (symbol_type)
    {
        const workSpace = this.document._$workSpace;

        switch (symbol_type) {

            case "button":
            case "movie clip":
            case "graphic":
                {
                    const beforeInstance = workSpace.getLibrary(
                        this._$character.libraryId
                    );

                    if (beforeInstance.type === InstanceType.MOVIE_CLIP) {
                        return ;
                    }

                    const id = workSpace.nextLibraryId;
                    const instance = workSpace.addLibrary(
                        Util.$controller.createContainer(
                            InstanceType.MOVIE_CLIP, `MovieClip_${id}`, id
                        )
                    );

                    const character  = this._$character.clone();
                    const totalFrame = character._$endFrame - character._$startFrame + 1;

                    const moveFrame = character._$startFrame - 1;
                    const places = new Map();
                    for (let [frame, place] of character._$places) {
                        place.frame = frame - moveFrame;
                        places.set(place.frame, place);
                    }
                    character._$places     = places;
                    character._$startFrame = 1;
                    character._$endFrame   = totalFrame;
                    character._$cachePlaces.length = 0;

                    const layer = new Layer();

                    // clone frame
                    const frameClass = this
                        ._$parent
                        ._$parent
                        ._$layer
                        ._$frame;
                    for (let [frame, css] of frameClass._$classes) {
                        if (1 > frame - moveFrame) {
                            continue;
                        }
                        layer._$frame._$classes.set(frame - moveFrame, css);
                    }

                    instance.setLayer(instance._$layerId++, layer);
                    layer.addCharacter(character);

                    // cache clear
                    this._$character._$currentFrame = 0;
                    this._$character._$currentPlace = null;
                    this._$character.dispose();

                    // update
                    this._$character._$libraryId = id;
                    for (let place of this._$character._$places.values()) {
                        place.loop = Util.$getDefaultLoopConfig();
                    }

                    workSpace.scene.changeFrame(
                        Util.$timelineFrame.currentFrame
                    );
                }
                break;

            default:
                break;

        }
    }

}
