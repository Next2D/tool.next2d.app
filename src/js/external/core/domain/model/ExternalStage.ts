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
     * @method
     * @public
     */
    getWidth (): number
    {
        return this._$workSpace.stage.width;
    }
    async setWidth (width: number): Promise<void>
    {
        await externalStageUpdateWidthUseCase(
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
     * @method
     */
    getHeight (): number
    {
        return this._$workSpace.stage.height;
    }
    async setHeight (height: number): Promise<void>
    {
        await externalStageUpdateHeightUseCase(
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
     * @method
     */
    getFps (): number
    {
        return this._$workSpace.stage.fps;
    }
    async setFps (fps: number): Promise<void>
    {
        await externalStageUpdateFpsUseCase(
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
     * @method
     */
    getBgColor (): string
    {
        return this._$workSpace.stage.bgColor;
    }
    async setBgColor (color: string): Promise<void> {
        await externalStageUpdateColorUseCase(
            this._$workSpace,
            color
        );
    }
}