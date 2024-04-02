import type { EmptyCharacterSaveObjectImpl } from "@/interface/EmptyCharacterSaveObjectImpl";

/**
 * @description 空のキーフレームの管理クラス
 *              Empty keyframe management class
 *
 * @class
 */
export class EmptyCharacter
{
    private _$startFrame: number;
    private _$endFrame: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startFrame = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$endFrame = 0;
    }

    /**
     * @description セーブオブジェクトからrestore
     *              restore from save object
     *
     * @param {objct} save_object
     * @method
     * @public
     */
    load (save_object: EmptyCharacterSaveObjectImpl): void
    {
        this._$startFrame = save_object.startFrame;
        this._$endFrame   = save_object.endFrame;
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
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): EmptyCharacterSaveObjectImpl
    {
        return {
            "startFrame": this.startFrame,
            "endFrame": this.endFrame
        };
    }
}