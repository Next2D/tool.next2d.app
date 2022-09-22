/**
 * @class
 * @memberOf external
 */
class ExternalLayer
{
    /**
     * @param {Layer} layer
     */
    constructor (layer)
    {
        this._$layer = layer;
    }

    /**
     * @return {array}
     */
    get frames ()
    {
        const frames = [undefined];
        const totalFrame = this._$layer.totalFrame;
        for (let frame = 1; totalFrame >= frame; ++frame) {
            frames.push(new ExternalFrame(frame, this));
        }
        return frames;
    }

    /**
     * @return {boolean}
     * @public
     */
    get locked ()
    {
        return this._$layer.lock;
    }

    /**
     * @param  {boolean} lock
     * @return {void}
     * @public
     */
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
