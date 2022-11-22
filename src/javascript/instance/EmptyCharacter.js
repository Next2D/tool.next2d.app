/**
 * 空のキーフレーム用クラス
 * Class for empty keyframes
 *
 * @class
 * @memberOf instance
 */
class EmptyCharacter
{
    /**
     * @param {object} [object=null]
     *
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$startFrame = object ? object.startFrame : 1;

        /**
         * @type {number}
         * @default 2
         * @private
         */
        this._$endFrame = object ? object.endFrame : 2;
    }

    /**
     * @description 開始フレーム番号
     *              start frame number
     *
     * @member {number}
     * @public
     */
    get startFrame ()
    {
        return this._$startFrame;
    }
    set startFrame (start_frame)
    {
        this._$startFrame = start_frame | 0;
    }

    /**
     * @description 終了フレーム番号
     *              end frame number
     *
     * @member {number}
     * @public
     */
    get endFrame ()
    {
        return this._$endFrame;
    }
    set endFrame (end_frame)
    {
        this._$endFrame = end_frame | 0;
    }

    /**
     * @description EmptyCharacterクラスを複製
     *              Duplicate EmptyCharacter class
     *
     * @return {EmptyCharacter}
     * @method
     * @public
     */
    clone ()
    {
        return new EmptyCharacter(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
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
     *              Move to the specified frame
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
     *              Deletes the width of the specified frame and splits it
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

    /**
     * @description 空のキーフレームの開始・終了のフレームを返す
     *              Returns the start and end frames of empty keyframes
     *
     * @return {object}
     * @method
     * @public
     */
    getRange ()
    {
        return {
            "startFrame": this.startFrame,
            "endFrame": this.endFrame
        };
    }
}
