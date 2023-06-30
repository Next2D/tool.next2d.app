/**
 * @class
 * @memberOf external
 */
class ExternalLayer
{
    /**
     * @param {Layer} layer
     * @param {ExternalDocument} external_document
     * @constructor
     * @public
     */
    constructor (layer, external_document)
    {
        /**
         * @type {Layer}
         * @private
         */
        this._$layer = layer;

        /**
         * @type {ExternalDocument}
         * @default null
         * @private
         */
        this._$document = external_document;
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
        const frames = [null];
        const totalFrame = this._$layer.totalFrame;
        for (let frame = 1; totalFrame >= frame; ++frame) {
            frames.push(new ExternalFrame(frame, this));
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
