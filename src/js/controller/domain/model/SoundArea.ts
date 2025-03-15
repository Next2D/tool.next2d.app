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
    /**
     * @description 操作する音声エリアのインデックスを返却
     *              Returns the index of the sound area to operate
     *
     * @member {number}
     * @default -1
     * @public
     */
    public targetIndex: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.targetIndex = -1;
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
}

export const soundArea = new SoundArea();