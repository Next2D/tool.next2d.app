/**
 * @class
 * @memberOf external
 */
class ExternalLayer
{
    /**
     * @param {Layer} layer
     * @param {ExternalTimeline} parent
     * @constructor
     * @public
     */
    constructor (layer, parent)
    {
        /**
         * @type {Layer}
         * @private
         */
        this._$layer = layer;

        /**
         * @type {ExternalTimeline}
         * @default null
         * @private
         */
        this._$parent = parent;
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get layerType ()
    {
        switch (this._$layer.mode) {

            case LayerMode.NORMAL:
                return "normal";

            case LayerMode.MASK:
                return "mask";

            case LayerMode.MASK_IN:
                return "masked";

            case LayerMode.GUIDE:
                return "guide";

            case LayerMode.GUIDE_IN:
                return "guided";

            case LayerMode.FOLDER:
                return "folder";

            default:
                return "";

        }

    }

    /**
     * @return {array}
     * @readonly
     * @public
     */
    get frames ()
    {
        const frames = [];
        const totalFrame = this._$parent._$scene.totalFrame;
        switch (this._$layer._$name) {

            case "script":
                {
                    const actions = this._$layer._$actions;
                    if (actions) {
                        let keyFrame  = 1;
                        for (let frame = 1; totalFrame >= frame; ++frame) {
                            if (actions.has(frame)) {
                                keyFrame = frame;
                            }
                            frames.push(new ExternalFrame(frame, keyFrame - 1, this));
                        }
                    }
                }
                break;

            case "label":
                {
                    const labels = this._$layer._$labels;
                    if (labels) {
                        let keyFrame  = 1;
                        for (let frame = 1; totalFrame >= frame; ++frame) {
                            if (labels.has(frame)) {
                                keyFrame = frame;
                            }
                            frames.push(new ExternalFrame(frame, keyFrame - 1, this));
                        }
                    }
                }
                break;

            case "sound":
                {
                    const sounds = this._$layer._$sounds;
                    if (sounds) {
                        let keyFrame  = 1;
                        for (let frame = 1; totalFrame >= frame; ++frame) {
                            if (sounds.has(frame)) {
                                keyFrame = frame;
                            }
                            frames.push(new ExternalFrame(frame, keyFrame - 1, this));
                        }
                    }
                }
                break;

            default:
                {
                    let keyFrame = 1;
                    for (let frame = 1; totalFrame >= frame; ++frame) {
                        const characters = this._$layer.getActiveCharacter(frame);
                        if (characters.length) {
                            keyFrame = frame;
                        }
                        const emptyCharacter = this._$layer.getActiveEmptyCharacter(frame);
                        if (emptyCharacter) {
                            keyFrame = frame;
                        }
                        frames.push(new ExternalFrame(frame, keyFrame - 1, this));
                    }
                }
                break;

        }

        return frames;
    }

    /**
     * @member {boolean}
     * @public
     */
    get locked ()
    {
        return this._$layer.lock;
    }
    set locked (lock)
    {
        this._$layer.lock = !!lock;

        const element = document
            .getElementById(`layer-lock-icon-${this._$layer.id}`);

        element.classList.remove("icon-disable", "icon-active");
        element.classList.add(this._$layer.lock ? "icon-active" : "icon-disable");
    }

    /**
     * @return {string}
     * @public
     */
    get name ()
    {
        return this._$layer.name;
    }
}
