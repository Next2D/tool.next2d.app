import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description スクリーン操作の管理クラス
 *              Management class for screen operation
 *
 * @class
 * @public
 */
export class ExternalScreen
{
    private readonly _$workSpace: WorkSpace;
    private readonly _$movieClip: MovieClip;

    /**
     * @param {WorkSpace} work_space
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
     * @description 指定したレイヤーのDisplayObjectを選択
     *              Select the display object of the specified layer
     *
     * @param  {number} layer_index
     * @param  {array} depths
     * @return {void}
     * @method
     * @public
     */
    selectDisplayObjects (layer_index: number, depths: number[]): void
    {
        console.log(layer_index, depths);
    }
}