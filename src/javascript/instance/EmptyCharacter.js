/**
 * @class
 */
class EmptyCharacter
{
    /**
     * @param {object} object
     *
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        if (object) {
            this._$startFrame = object.startFrame;
            this._$endFrame   = object.endFrame;
        } else {
            this._$startFrame = 1;
            this._$endFrame   = 2;
        }
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
     * @return {EmptyCharacter}
     * @method
     * @public
     */
    clone ()
    {
        return new EmptyCharacter(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @return {object}
     * @method
     * @public
     */
    toObject ()
    {
        return {
            "startFrame": this.startFrame,
            "endFrame": this.endFrame
        };
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
        this._$startFrame += frame;
        this._$endFrame   += frame;
    }

    /**
     * @description 指定フレームの幅を削除して分割
     *
     * @param  {Layer} layer
     * @param  {number} start_frame
     * @param  {number} end_frame
     * @return {void}
     * @method
     * @public
     */
    split (layer, start_frame, end_frame)
    {
        // 一旦削除
        layer.deleteEmptyCharacter(this);

        if (start_frame > this.startFrame) {
            layer.addEmptyCharacter(new EmptyCharacter({
                "startFrame": this.startFrame,
                "endFrame": start_frame
            }));
        }

        if (this.endFrame > end_frame) {
            layer.addEmptyCharacter(new EmptyCharacter({
                "startFrame": end_frame,
                "endFrame": this.endFrame
            }));
        }

    }
}
