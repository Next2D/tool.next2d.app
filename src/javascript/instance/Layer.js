/**
 * @class
 */
class Layer
{
    /**
     * @param {object} [object=null]
     * @constructor
     */
    constructor (object = null)
    {
        this._$id         = 0;
        this._$characters = [];
        this._$instances  = new Map();

        this._$maskId     = null;
        this._$guideId    = null;
        this._$name       = null;
        this._$light      = false;
        this._$disable    = false;
        this._$lock       = false;
        this._$mode       = Util.LAYER_MODE_NORMAL;
        this._$frame      = new Frame();

        if (object) {
            this._$name      = object.name;
            this._$light     = object.light;
            this._$disable   = object.disable;
            this._$lock      = object.lock;
            this._$mode      = object.mode;
            this._$maskId    = object.maskId;
            this._$guideId   = object.guideId;
            this.frame       = new Frame(object.frames);
            this.characters  = object.characters;
        }
    }

    /**
     * @return {void}
     * @public
     */
    initialize ()
    {
        Util.$timelineLayer.create();

        const element = document
            .getElementById("timeline-content")
            .lastElementChild;

        // set id
        this.id = element.dataset.layerId | 0;
        this._$frame._$layerId = this.id;

        const name = document.getElementById(`layer-name-${this.id}`);
        if (this.name) {
            name.textContent = this.name;
            document
                .getElementById(`layer-name-input-${this.id}`)
                .value = this.name;
        } else {
            this.name = name.textContent;
        }

        if (this.light) {

            const lightIcon = document
                .getElementById(`layer-light-icon-${this.id}`);

            lightIcon
                .classList
                .remove("icon-disable");

            lightIcon
                .classList
                .add("icon-active");

            element.classList.add("light-active");
        }

        if (this.disable) {

            const disableIcon = document
                .getElementById(`layer-disable-icon-${this.id}`);

            disableIcon
                .classList
                .remove("icon-disable");

            disableIcon
                .classList
                .add("icon-active");
        }

        if (this.lock) {

            const lockIcon = document
                .getElementById(`layer-lock-icon-${this.id}`);

            lockIcon
                .classList
                .remove("icon-disable");

            lockIcon
                .classList
                .add("icon-active");
        }

        // view
        this.showIcon();

        this._$frame.initialize();
    }

    /**
     * @param  {number} [frame=1]
     * @return {void}
     * @public
     */
    appendCharacter (frame = 1)
    {
        if (this.disable) {
            return ;
        }

        const element = document.getElementById("timeline-onion-skin");
        if (element.classList.contains("onion-skin-active")
            && Util.$timeline._$stopFlag
        ) {

            const classes = this._$frame._$classes;

            let mainFrame = frame;
            if (classes.has(frame)) {
                while (mainFrame > 1) {

                    if (classes.get(mainFrame).indexOf("key-frame") > -1 ||
                        classes.get(mainFrame).indexOf("empty-key-frame") > -1 ||
                        classes.get(mainFrame).indexOf("tween-frame") > -1
                    ) {
                        break;
                    }

                    --mainFrame;
                }
            }

            const cacheFrame = Util.$timelineFrame.currentFrame;

            const size = classes.size + 1;
            for (let currentFrame = 1; currentFrame < size; ++currentFrame) {

                if (mainFrame === currentFrame) {
                    continue;
                }

                if (!classes.has(currentFrame)) {
                    continue;
                }

                if (classes.get(currentFrame).indexOf("key-frame") === -1
                    && classes.get(currentFrame).indexOf("tween-frame") === -1
                ) {
                    continue;
                }

                Util.$timelineFrame.currentFrame = currentFrame;

                const characters = this.getActiveCharacter(currentFrame);
                if (!characters.length) {
                    continue;
                }

                this.sort(characters, currentFrame);

                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];
                    character._$image = null;

                    Util.$screen.appendOnionCharacter(character, this.id);
                }
            }

            Util.$timelineFrame.currentFrame = cacheFrame;

            const characters = this.getActiveCharacter(cacheFrame);
            if (characters.length) {

                this.sort(characters, cacheFrame);

                const event = this.lock ? "none" : "auto";
                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];
                    character._$image = null;

                    Util.$screen.appendCharacter(
                        character, cacheFrame, this.id, event
                    );
                }

            }

        } else {

            const characters = this.getActiveCharacter(frame);
            if (characters.length) {

                if (characters.length > 1) {
                    this.sort(characters, frame);
                }

                const event = this.lock ? "none" : "auto";
                for (let idx = 0; idx < characters.length; ++idx) {
                    Util.$screen.appendCharacter(
                        characters[idx], frame, this.id, event
                    );
                }

            }
        }
    }

    /**
     * @param {array}  characters
     * @param {number} frame
     * @public
     */
    sort (characters, frame)
    {
        characters.sort((a, b) =>
        {
            const depthA = a.getPlace(frame).depth;
            const depthB = b.getPlace(frame).depth;
            switch (true) {

                case depthA > depthB:
                    return 1;

                case depthA < depthB:
                    return -1;

                default:
                    return 0;

            }
        });
    }

    /**
     * @param  {number} [frame=1]
     * @return {array}
     * @public
     */
    getActiveCharacter (frame = 1)
    {
        const characters = [];
        for (let idx = 0; idx < this._$characters.length; ++idx) {

            const character = this._$characters[idx];

            if (character.startFrame > frame) {
                continue;
            }

            if (frame >= character.endFrame) {
                continue;
            }

            characters.push(character);
        }
        return characters;
    }

    /**
     * @return {void}
     * @public
     */
    clearActiveCharacter ()
    {
        for (let idx = 0; idx < this._$characters.length; ++idx) {

            const character = this._$characters[idx];

            const element = document
                .getElementById(`character-${character.id}`);

            if (element) {
                element.style.border = "";
            }
        }
    }

    /**
     * @return {void}
     * @public
     */
    showIcon ()
    {

        // default
        const layerNameElement = document
            .getElementById(`layer-name-${this.id}`);

        layerNameElement
            .classList
            .remove("in-view-text");

        layerNameElement
            .classList
            .add("view-text");

        const inputElement = document
            .getElementById(`layer-name-input-${this.id}`);

        inputElement
            .classList
            .remove("in-view-text-input");

        switch (this._$mode) {

            case Util.LAYER_MODE_NORMAL:

                document
                    .getElementById(`layer-icon-${this.id}`)
                    .style.display = "";
                document
                    .getElementById(`layer-mask-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-mask-in-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-guide-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-guide-in-icon-${this.id}`)
                    .style.display = "none";

                break;

            case Util.LAYER_MODE_MASK:

                document
                    .getElementById(`layer-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-mask-icon-${this.id}`)
                    .style.display = "";
                document
                    .getElementById(`layer-mask-in-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-guide-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-guide-in-icon-${this.id}`)
                    .style.display = "none";

                break;

            case Util.LAYER_MODE_MASK_IN:
                {
                    document
                        .getElementById(`layer-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-in-icon-${this.id}`)
                        .style.display = "";
                    document
                        .getElementById(`layer-guide-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-in-icon-${this.id}`)
                        .style.display = "none";

                    const layerNameElement = document
                        .getElementById(`layer-name-${this.id}`);

                    layerNameElement
                        .classList
                        .remove("view-text");

                    layerNameElement
                        .classList
                        .add("in-view-text");

                    const inputElement = document
                        .getElementById(`layer-name-input-${this.id}`);

                    inputElement
                        .classList
                        .add("in-view-text-input");

                }
                break;

            case Util.LAYER_MODE_GUIDE:

                document
                    .getElementById(`layer-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-mask-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-mask-in-icon-${this.id}`)
                    .style.display = "none";
                document
                    .getElementById(`layer-guide-icon-${this.id}`)
                    .style.display = "";
                document
                    .getElementById(`layer-guide-in-icon-${this.id}`)
                    .style.display = "none";

                break;

            case Util.LAYER_MODE_GUIDE_IN:
                {
                    document
                        .getElementById(`layer-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-mask-in-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-icon-${this.id}`)
                        .style.display = "none";
                    document
                        .getElementById(`layer-guide-in-icon-${this.id}`)
                        .style.display = "";

                    const layerNameElement = document
                        .getElementById(`layer-name-${this.id}`);

                    layerNameElement
                        .classList
                        .remove("view-text");

                    layerNameElement
                        .classList
                        .add("in-view-text");

                    const inputElement = document
                        .getElementById(`layer-name-input-${this.id}`);

                    inputElement
                        .classList
                        .add("in-view-text-input");
                }
                break;

            default:
                break;

        }
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
        this._$name = name;
    }

    /**
     * @return {boolean}
     * @public
     */
    get light ()
    {
        return this._$light;
    }

    /**
     * @param  {boolean} light
     * @return {void}
     * @public
     */
    set light (light)
    {
        this._$light = light;
    }

    /**
     * @return {boolean}
     * @public
     */
    get disable ()
    {
        return this._$disable;
    }

    /**
     * @param  {boolean} disable
     * @return {void}
     * @public
     */
    set disable (disable)
    {
        this._$disable = disable;
    }

    /**
     * @return {boolean}
     * @public
     */
    get lock ()
    {
        return this._$lock;
    }

    /**
     * @param  {boolean} lock
     * @return {void}
     * @public
     */
    set lock (lock)
    {
        this._$lock = lock;
    }

    /**
     * @return {object}
     * @public
     */
    get frame ()
    {
        return this._$frame.toObject();
    }

    /**
     * @param  {Frame} frame
     * @return {void}
     * @public
     */
    set frame (frame)
    {
        this._$frame = frame;
    }

    /**
     * @return {array}
     * @public
     */
    get characters ()
    {
        const characters = [];
        for (let idx = 0; idx < this._$characters.length; ++idx) {
            characters.push(this._$characters[idx].toObject());
        }
        return characters;
    }

    /**
     * @param  {array} characters
     * @return {void}
     * @public
     */
    set characters (characters)
    {
        for (let idx = 0; idx < characters.length; ++idx) {

            const character = new Character(characters[idx]);

            this._$instances.set(character.id, character);
            this._$characters.push(character);
        }
    }

    /**
     * @param  {number} character_id
     * @return {Character}
     * @public
     */
    getCharacter (character_id)
    {
        return this._$instances.get(character_id | 0);
    }

    /**
     * @param  {Character} character
     * @return {void}
     * @public
     */
    addCharacter (character)
    {
        this._$characters.push(character);
        this._$instances.set(character.id, character);
    }

    /**
     * @param  {number} character_id
     * @return {void}
     * @public
     */
    deleteCharacter (character_id)
    {
        if (this._$instances.has(character_id | 0)) {

            const character = this._$instances.get(character_id | 0);

            this._$characters.splice(this._$characters.indexOf(character), 1);

            this._$instances.delete(character_id | 0);
        }
    }

    /**
     * @param  {number} frame
     * @return {number}
     */
    getEndFrame (frame)
    {
        while (this._$frame.hasClasses(frame)) {

            const classes = this._$frame.getClasses(frame);

            switch (true) {

                case classes.indexOf("key-frame") > -1:
                case classes.indexOf("empty-key-frame") > -1:
                    return frame;

                case classes.indexOf("key-space-frame-end") > -1:
                case classes.indexOf("empty-space-frame-end") > -1:
                    return frame + 1;

                default:
                    break;

            }

            frame++;
        }

        return frame;
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get totalFrame ()
    {
        let frame = 1;
        for (let idx = 0; idx < this._$characters.length; ++idx) {

            const character = this._$characters[idx];
            frame = Math.max(frame, character.endFrame);

        }
        return frame;
    }

    /**
     * @return {number}
     * @public
     */
    get mode ()
    {
        return this._$mode;
    }

    /**
     * @param  {number} mode
     * @return {void}
     * @public
     */
    set mode (mode)
    {
        this._$mode = mode;
    }

    /**
     * @return {number|null}
     * @public
     */
    get maskId ()
    {
        return this._$maskId;
    }

    /**
     * @param  {number|null} mask_id
     * @return {void}
     * @public
     */
    set maskId (mask_id)
    {
        this._$maskId = mask_id === null
            ? null
            : mask_id | 0;
    }

    /**
     * @return {number|null}
     * @public
     */
    get guideId ()
    {
        return this._$guideId;
    }

    /**
     * @param  {number|null} guide_id
     * @return {void}
     * @public
     */
    set guideId (guide_id)
    {
        this._$guideId = guide_id === null
            ? null
            : guide_id | 0;
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "name":       this.name,
            "light":      this.light,
            "disable":    this.disable,
            "lock":       this.lock,
            "mode":       this.mode,
            "maskId":     this.maskId,
            "guideId":    this.guideId,
            "frames":     this.frame,
            "characters": this.characters
        };
    }
}
