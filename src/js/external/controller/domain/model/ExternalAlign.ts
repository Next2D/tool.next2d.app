import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalAlignLeftUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignLeftUseCase";
import { execute as externalAlignCenterUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignCenterUseCase";
import { execute as externalAlignRightUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignRightUseCase";
import { execute as externalAlignTopUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignTopUseCase";
import { execute as externalAlignMiddleUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignMiddleUseCase";
import { execute as externalAlignBottomUseCase } from "@/external/controller/application/ExternalAlign/usecase/ExternalAlignBottomUseCase";

export class ExternalAlign
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
     * @description 選択範囲の左端に合わせて選択中のキャラクターを移動
     *              Move the selected character to the left edge of the selection
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async left (): Promise<void>
    {
        await externalAlignLeftUseCase(this._$workSpace, this._$movieClip);
    }

    /**
     * @description 選択範囲の中央に合わせて選択中のキャラクターを移動
     *              Move the selected character to the center of the selection
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async center (): Promise<void>
    {
        await externalAlignCenterUseCase(this._$workSpace, this._$movieClip);
    }

    /**
     * @description 選択範囲の右端に合わせて選択中のキャラクターを移動
     *              Move the selected character to the right edge of the selection
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async right (): Promise<void>
    {
        await externalAlignRightUseCase(this._$workSpace, this._$movieClip);
    }

    /**
     * @description 選択範囲の上端に合わせて選択中のキャラクターを移動
     *              Move the selected character to the top of the selection
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async top (): Promise<void>
    {
        await externalAlignTopUseCase(this._$workSpace, this._$movieClip);
    }

    /**
     * @description 選択範囲の中央に合わせて選択中のキャラクターを移動
     *              Move the selected character to the middle of the selection
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async middle (): Promise<void>
    {
        await externalAlignMiddleUseCase(this._$workSpace, this._$movieClip);
    }

    /**
     * @description 選択範囲の下端に合わせて選択中のキャラクターを移動
     *              Move the selected character to the bottom of the selection
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async bottom (): Promise<void>
    {
        await externalAlignBottomUseCase(this._$workSpace, this._$movieClip);
    }
}