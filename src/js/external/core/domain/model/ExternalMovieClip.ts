import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description MovieClipの外部APIクラス
 *              MovieClip external API classes
 * @class
 */
export class ExternalMovieClip
{
    private readonly _$movieClip: MovieClip;

    /**
     * @constructor
     * @public
     */
    constructor (movie_clip: MovieClip)
    {
        /**
         * @type {MovieClip}
         * @private
         */
        this._$movieClip = movie_clip;
    }
}