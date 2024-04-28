import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalStageUpdateWidthUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateWidthUseCase";
import { execute as externalStageUpdateHeightUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateHeightUseCase";
import { execute as externalStageUpdateFpsUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateFpsUseCase";

/**
 * @description ステージの管理クラス
 *              Management class of the stage
 *
 * @class
 * @public
 */
export class ExternalStage
{
    private readonly _$workSpace: WorkSpace;

    /**
     * @param {WorkSpace} work_space
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace)
    {
        this._$workSpace = work_space;
    }

    /**
     * @description ステージの幅の値
     *              Value of the width of the stage
     *
     * @member {number}
     * @public
     */
    get width (): number
    {
        return this._$workSpace.stage.width;
    }
    set width (width: number)
    {
        externalStageUpdateWidthUseCase(
            this._$workSpace,
            width
        );
    }

    /**
     * @description ステージの高さの値
     *              Value of the height of the stage
     *
     * @member {number}
     * @public
     */
    get height (): number
    {
        return this._$workSpace.stage.height;
    }
    set height (height: number)
    {
        externalStageUpdateHeightUseCase(
            this._$workSpace,
            height
        );
    }

    /**
     * @description ステージのフレームレートの値
     *              Value of the frame rate of the stage
     *
     * @member {number}
     * @public
     */
    get fps (): number
    {
        return this._$workSpace.stage.fps;
    }
    set fps (fps: number)
    {
        externalStageUpdateFpsUseCase(
            this._$workSpace,
            fps
        );
    }
}