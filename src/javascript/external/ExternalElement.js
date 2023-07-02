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
                return "symbol";

            default:
                return "symbol";

        }
    }

    /**
     * @member {Matrix}
     * @public
     */
    get matrix ()
    {
        const { Matrix } = next2d.geom;
        const place = this._$character.getPlace(this._$parent._$frame);
        return new Matrix(
            place.matrix[0], place.matrix[1], place.matrix[2],
            place.matrix[3], place.matrix[4], place.matrix[5]
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
                    const bitmapObject = instance._$recodes[instance._$recodes.length - 4];

                    const bitmapInstance = workSpace.getLibrary(
                        bitmapObject._$instanceId
                    );

                    return new ExternalBitmapItem(bitmapInstance, externalDocument);
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
     * @member {string}
     * @public
     */
    get symbolType ()
    {
        const workSpace = this.document._$workSpace;

        const instance = workSpace.getLibrary(
            this._$character.libraryId
        );

        return instance.type === InstanceType.MOVIE_CLIP ? "graphic" : "";
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
