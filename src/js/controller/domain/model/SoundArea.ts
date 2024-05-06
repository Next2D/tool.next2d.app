import { execute as soundAreaInitializeRegisterEventUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaInitializeRegisterEventUseCase";

/**
 * @description 音声エリアの管理クラス
 *              Sound area management class
 *
 * @class
 * @public
 */
class SoundArea
{
    private _$targetIndex: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$targetIndex = -1;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        soundAreaInitializeRegisterEventUseCase();
    }

    /**
     * @description 操作する音声エリアのインデックスを返却
     *              Returns the index of the sound area to operate
     *
     * @member {number}
     * @method
     */
    get targetIndex (): number
    {
        return this._$targetIndex;
    }
    set targetIndex (index: number)
    {
        this._$targetIndex = index;
    }
}

export const soundArea = new SoundArea();