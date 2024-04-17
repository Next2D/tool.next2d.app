import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalSoundAreaAddSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaAddSoundUseCase";

/**
 * @description サウンドエリアの外部APIクラス
 *              External API class for sound areas
 *
 * @class
 */
export class ExternalSoundArea
{
    private readonly _$workSpace: WorkSpace;
    private readonly _$movieClip: MovieClip;

    /**
     * @param {WorkSpace} work_space
     * @param {MovieClip} movie_clip
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip
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
    }

    /**
     * @description タイムラインの現在のフレームにサウンドを追加
     *              Add sound to the current frame of the timeline
     *
     * @param  {number} frame
     * @param  {string} path
     * @return {void}
     * @method
     * @public
     */
    addSound (
        frame: number,
        path: string
    ): void {
        externalSoundAreaAddSoundUseCase(
            this._$workSpace,
            this._$movieClip,
            frame,
            path
        );
    }
}