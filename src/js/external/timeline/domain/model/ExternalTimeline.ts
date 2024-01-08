import type { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import type { ExternalWorkSpace } from "@/external/core/domain/model/ExternalWorkSpace";

/**
 * @description タイムラインの外部APIクラス
 *              Timeline External API Class
 *
 * @class
 */
export class ExternalTimeline
{
    private readonly _$externalMovieClip: ExternalMovieClip;
    private readonly _$externalWorkSpace: ExternalWorkSpace;

    /**
     * @param {ExternalMovieClip} external_movie_clip
     * @param {ExternalWorkSpace} external_work_space
     * @constructor
     * @public
     */
    constructor (
        external_movie_clip: ExternalMovieClip,
        external_work_space: ExternalWorkSpace
    ) {
        /**
         * @type {ExternalMovieClip}
         * @private
         */
        this._$externalMovieClip = external_movie_clip;

        /**
         * @type {ExternalWorkSpace}
         * @private
         */
        this._$externalWorkSpace = external_work_space;
    }
}