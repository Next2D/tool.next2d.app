import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import { execute as externalSoundUpdateVolumeUseCase } from "@/external/core/application/ExternalSoundObject/usecase/ExternalSoundUpdateVolumeUseCase";
import { execute as externalSoundUpdateLoopCountUseCase } from "@/external/core/application/ExternalSoundObject/usecase/ExternalSoundUpdateLoopCountUseCase";

/**
 * @description 個別の音声設定の管理クラス
 *              Management class for individual sound settings
 *
 * @class
 * @public
 */
export class ExternalSoundObject
{
    private readonly _$workSpace: WorkSpace;
    private readonly _$movieClip: MovieClip;
    private readonly _$soundObject: SoundObjectImpl;
    private readonly _$frame: number;
    private readonly _$index: number;

    /**
     * @param {WorkSpace} work_space
     * @param {MovieClip} movie_clip
     * @param {object} sound_object
     * @param {number} frame
     * @param {number} index
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip,
        sound_object: SoundObjectImpl,
        frame: number,
        index: number
    ) {
        /**
         * @type {WorkSpace}
         * @private
         */
        this._$workSpace = work_space;

        /**
         * @type {MovieClip}
         * @private
         */
        this._$movieClip = movie_clip;

        /**
         * @type {MovieClip}
         * @private
         */
        this._$soundObject = sound_object;

        /**
         * @type {number}
         * @private
         */
        this._$frame = frame;

        /**
         * @type {number}
         * @private
         */
        this._$index = index;
    }

    /**
     * @description 音量調整(0 - 100)
     *              Volume adjustment (0 - 100)
     *
     * @type {number}
     * @public
     */
    get volume (): number
    {
        return this._$soundObject.volume;
    }
    set volume (volume: number)
    {
        externalSoundUpdateVolumeUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$soundObject,
            this._$frame,
            this._$index,
            volume
        );
    }

    /**
     * @description ループ回数(0 - 65535)
     *              Loop count (0 - 65535)
     *
     * @type {number}
     * @public
     */
    get loopCount (): number
    {
        return this._$soundObject.volume;
    }
    set loopCount (loop_count: number)
    {
        externalSoundUpdateLoopCountUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$soundObject,
            this._$frame,
            this._$index,
            loop_count
        );
    }
}