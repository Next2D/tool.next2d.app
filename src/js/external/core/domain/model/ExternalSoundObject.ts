import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";

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

    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip,
        sound_object: SoundObjectImpl
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
    }

    /**
     * @description 音量調整
     *              Volume adjustment
     *
     * @type {number}
     * @public
     */
    get volume(): number
    {
        return this._$soundObject.volume;
    }
    set volume (volume: number)
    {
        this._$soundObject.volume = volume;
    }
}