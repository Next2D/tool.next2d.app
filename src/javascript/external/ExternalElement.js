/**
 * @class
 */
class ExternalElement
{
    /**
     * @param {Character} character
     * @param {ExternalLayer} parent
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
         * @type {ExternalLayer}
         * @private
         */
        this._$parent = parent;
    }

    /**
     * @return {number}
     * @public
     */
    get x ()
    {
        return this._$character.x;
    }

    /**
     * @param  {number} x
     * @return {void}
     * @public
     */
    set x (x)
    {
        this._$character.x = x;

        const workSpace = Util.$currentWorkSpace();
        const instance  = workSpace
            .getLibrary(this._$character.libraryId);

        let frame = Util.$timelineFrame.currentFrame;

        const place = this._$character.getPlace(frame);

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
     * @return {number}
     * @public
     */
    get y ()
    {
        return this._$character.y;
    }

    /**
     * @param  {number} y
     * @return {void}
     * @public
     */
    set y (y)
    {
        this._$character.y = y;

        const workSpace = Util.$currentWorkSpace();
        const instance  = workSpace
            .getLibrary(this._$character.libraryId);

        let frame = Util.$timelineFrame.currentFrame;

        const place = this._$character.getPlace(frame);

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
     * @return {ExternalLibrary}
     * @readonly
     * @public
     */
    get libraryItem ()
    {
        return new ExternalLibrary(Util
            .$currentWorkSpace()
            .getLibrary(this._$character.libraryId)
        );
    }

    /**
     * @return {string}
     * @public
     */
    get loop ()
    {
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(
                this._$character.libraryId
            );

        if (instance.type !== "container") {
            return "";
        }

        const place = this._$character.getPlace(this._$character.startFrame);
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

    /**
     *
     * @param  {string} loop_type
     * @return {void}
     * @public
     */
    set loop (loop_type)
    {
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(
                this._$character.libraryId
            );

        if (instance.type !== "container") {
            return ;
        }

        const place = this
            ._$character
            .getPlace(this._$character.startFrame);

        switch (loop_type) {

            case "loop":
                place.loop.type = 0;
                break;

            case "play once":
                place.loop.type = 1;
                break;

            case "single frame":
                place.loop.type = 2;
                break;

            default:
                place.loop.type = Util.DEFAULT_LOOP;
                break;

        }
    }

    /**
     * @return {string}
     * @public
     */
    get symbolType ()
    {
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(
                this._$character.libraryId
            );

        return instance.type === InstanceType.MOVIE_CLIP ? "movie clip" : "";
    }

    /**
     * @param  {string} symbol_type
     * @return {void}
     * @public
     */
    set symbolType (symbol_type)
    {
        switch (symbol_type) {

            case "button":
            case "movie clip":
            case "graphic":
                {
                    const workSpace = Util.$currentWorkSpace();

                    const beforeInstance = workSpace.getLibrary(
                        this._$character.libraryId
                    );
                    if (beforeInstance.type === "container") {
                        return ;
                    }

                    const id = workSpace.nextLibraryId;
                    const instance = workSpace.addLibrary(
                        Util.$controller.createContainer("container", `MovieClip_${id}`, id)
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

                    const layer = new Layer();

                    // clone frame
                    const frameClass = this._$parent._$layer._$frame;
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
                    this._$character._$image        = null;

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
