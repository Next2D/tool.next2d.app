import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPivotType } from "@/interface/IPivotType";
import { execute as externalReferenceSetPivotUseCase } from "@/external/controller/application/ExternalReference/usecase/ExternalReferenceSetPivotUseCase";
import { execute as externalReferenceSetXUseCase } from "@/external/controller/application/ExternalReference/usecase/ExternalReferenceSetXUseCase";

/**
 * @description 変形の中心点エリアの外部APIクラス
 *              External API class for the center point area of transformation
 *
 * @class
 */
export class ExternalReference
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
     * @description 変形の中心点を設定
     *              Set the center point of transformation
     *
     * @param  {IPivotType} pivot
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setPivot (pivot: IPivotType): Promise<void>
    {
        await externalReferenceSetPivotUseCase(
            this._$workSpace,
            this._$movieClip,
            pivot
        );
    }

    /**
     * @description 中心点のx座標を設定
     *              Set the x-coordinate of the center point
     *
     * @param  {number} x
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setX (x: number): Promise<void>
    {
        externalReferenceSetXUseCase(
            this._$workSpace,
            this._$movieClip,
            x
        );
    }
}