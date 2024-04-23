import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalSoundAreaAddSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaAddSoundUseCase";
import { execute as externalSoundAreaRemoveSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaRemoveSoundUseCase";
import { ExternalSoundObject } from "@/external/core/domain/model/ExternalSoundObject";

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
     * @description 現在のMovieClipの指定フレームのサウンドオブジェクトを取得
     *              Get sound object of specified frame of current MovieClip
     *
     * @param  {number} frame
     * @param  {number} index
     * @return {ExternalSoundObject | null}
     * @method
     * @public
     */
    getSoundObject (frame: number, index: number): ExternalSoundObject | null
    {
        const sounds = this._$movieClip.getSound(frame);
        if (!sounds) {
            return null;
        }

        const soundObject = sounds[index];
        if (!soundObject) {
            return null;
        }

        return new ExternalSoundObject(
            this._$workSpace,
            this._$movieClip,
            soundObject,
            frame,
            index
        );
    }

    /**
     * @description 現在のMovieClipの指定フレームにサウンドを追加
     *              Add sound to the specified frame of the current MovieClip
     *
     * @param  {number} frame
     * @param  {string} path
     * @param  {number} [volume=100]
     * @param  {boolean} [auto_play=false]
     * @param  {number} [loop_count=0]
     * @return {void}
     * @method
     * @public
     */
    addSound (
        frame: number,
        path: string,
        volume: number = 100,
        auto_play: boolean = false,
        loop_count: number = 0
    ): void {
        externalSoundAreaAddSoundUseCase(
            this._$workSpace,
            this._$movieClip,
            frame,
            path,
            volume,
            auto_play,
            loop_count
        );
    }

    /**
     * @description 現在のMovieClipの指定フレームのサウンドを削除
     *              Remove sound of specified frame of current MovieClip
     *
     * @param  {number} frame
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    removeSound (frame: number, index: number): void
    {
        externalSoundAreaRemoveSoundUseCase(
            this._$workSpace,
            this._$movieClip,
            frame, index
        );
    }
}