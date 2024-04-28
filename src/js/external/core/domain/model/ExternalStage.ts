import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalStageUpdateWidthUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateWidthUseCase";
import { execute as externalStageUpdateHeightUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateHeightUseCase";
import { execute as externalStageUpdateFpsUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateFpsUseCase";
import { execute as externalStageUpdateColorUseCase } from "@/external/core/application/ExternalStage/usecase/ExternalStageUpdateColorUseCase";

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

    /**
     * @description ステージの背景色の値
     *              Value of the background color of the stage
     *
     * @member {string}
     * @public
     */
    get bgColor (): string
    {
        return this._$workSpace.stage.bgColor;
    }
    set bgColor (color: string)
    {
        externalStageUpdateColorUseCase(
            this._$workSpace,
            color
        );
    }
}