import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IInstance } from "@/interface/IInstance";
import { Graphics } from "@next2d/display";
import { ExternalItem } from "./ExternalItem";
import { execute as externalShapeApplyGraphicsUseCase } from "@/external/core/application/ExternalShape/usecase/ExternalShapeApplyGraphicsUseCase";

/**
 * @description ベクターアイテムのクラス
 *              Vector Item Class
 *
 * @class
 * @public
 */
export class ExternalShape extends ExternalItem
{
    private _$graphics: Graphics;

    /**
     * @param {WorkSpace} work_space
     * @param {Instance} instance
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace, instance: IInstance<any>)
    {
        super(work_space, instance);

        /**
         * @description Next2D Playerのグラフィックスクラス
         *              Next2D Player's Graphics Class
         *
         * @type {Graphics}
         */
        this._$graphics = new Graphics();
    }

    /**
     * @description Next2D Playerのグラフィックスクラス
     *              Next2D Player's Graphics Class
     *
     * @member {Graphics}
     * @readonly
     * @public
     */
    get graphics (): Graphics
    {
        return this._$graphics;
    }

    /**
     * @description グラフィックスの更新を適用
     *              Apply graphics update
     *
     * @return {Promise}
     * @method
     * @public
     */
    async applyGraphics (): Promise<void>
    {
        const bounds = {
            "xMin": this.graphics.xMin,
            "yMin": this.graphics.yMin,
            "xMax": this.graphics.xMax,
            "yMax": this.graphics.yMax
        };

        await externalShapeApplyGraphicsUseCase(
            this._$workSpace, this._$workSpace.scene, this._$instance,
            this.graphics.buffer, bounds
        );
    }
}