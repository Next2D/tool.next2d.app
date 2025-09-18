import { execute as referenceSettingInitializeRegisterEventUseCase } from "@/controller/application/ReferenceSetting/usecase/ReferenceSettingInitializeRegisterEventUseCase";
import type { IPivotType } from "@/interface/IPivotType";

/**
 * @description 中心点の管理クラス
 *              Management class for the center point
 *
 * @class
 * @public
 */
class ReferenceSetting
{
    /**
     * @description 中心点のx座標を返却
     *              Return the x coordinate of the center point
     *
     * @member {number}
     * @default 0
     * @public
     */
    public x: number;

    /**
     * @description 中心点のy座標を返却
     *              Return the y coordinate of the center point
     *
     * @member {number}
     * @default 0
     * @public
     */
    public y: number;

    /**
     * @description 中心点の位置を返却
     *              Return the position of the center point
     *
     * @member {IPivotType}
     * @default "middle-center"
     * @public
     */
    public pivot: IPivotType = "middle-center";

    /**
     * @description 中心点の表示状態を返却
     *              Return the display state of the center point
     *
     * @member {string}
     * @default "hide"
     * @public
     */
    public state: "hide" | "show";

    /**
     * @description 中心点の有効・無効状態を返却
     *              Returns whether the center point is enabled or disabled
     *
     * @member {boolean}
     * @default false
     * @public
     */
    public active: boolean = false;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.x      = 0;
        this.y      = 0;
        this.state  = "hide";
        this.pivot  = "middle-center";
        this.active = false;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        referenceSettingInitializeRegisterEventUseCase();
    }

    /**
     * @description 値のクリア
     *              Clear the values
     *
     * @return {void}
     * @method
     * @public
     */
    clear (): void
    {
        this.x      = 0;
        this.y      = 0;
        this.state  = "hide";
        this.pivot  = "middle-center";
        this.active = false;
    }
}

export const referenceSetting = new ReferenceSetting();