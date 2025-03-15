import type { IEmptyCharacterSaveObject } from "@/interface/IEmptyCharacterSaveObject";

/**
 * @description 空のキーフレームの管理クラス
 *              Empty keyframe management class
 *
 * @class
 */
export class EmptyCharacter
{
    /**
     * @description 開始フレーム番号
     *              start frame number
     *
     * @member {number}
     * @public
     */
    public startFrame: number;

    /**
     * @description 終了フレーム番号
     *              end frame number
     *
     * @member {number}
     * @public
     */
    public endFrame: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.startFrame = 0;
        this.endFrame   = 0;
    }

    /**
     * @description セーブオブジェクトからrestore
     *              restore from save object
     *
     * @param {objct} save_object
     * @method
     * @public
     */
    load (save_object: IEmptyCharacterSaveObject): void
    {
        this.startFrame = save_object.startFrame;
        this.endFrame   = save_object.endFrame;
    }

    /**
     * @description 指定フレーム移動させる
     *              Move the specified frame
     *
     * @param  {number} move_frame
     * @return {void}
     * @method
     * @public
     */
    move (move_frame: number): void
    {
        this.startFrame += move_frame;
        this.endFrame   += move_frame;
    }

    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): IEmptyCharacterSaveObject
    {
        return {
            "startFrame": this.startFrame,
            "endFrame": this.endFrame
        };
    }
}