import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Graphics } from "@next2d/display";
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
    constructor (work_space: WorkSpace, instance: InstanceImpl<any>)
    {
        super(work_space, instance);

        /**
         * @description Next2D Playerのグラフィックスクラス
         *              Next2D Player's Graphics Class
         *
         * @type {Graphics}
         */
        this._$graphics = new next2d.display.Graphics();
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
            "xMin": this.graphics._$xMin,
            "yMin": this.graphics._$yMin,
            "xMax": this.graphics._$xMax,
            "yMax": this.graphics._$yMax
        };

        await externalShapeApplyGraphicsUseCase(
            this._$workSpace, this._$workSpace.scene, this._$instance,
            this.graphics._$getRecodes(), bounds
        );
    }
}