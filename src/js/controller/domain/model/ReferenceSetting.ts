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
     * @description 中心点のグローバルx座標を返却
     *              Return the global x coordinate of the center point
     *
     * @member {number}
     * @default 0
     * @public
     */
    public x: number;

    /**
     * @description 中心点のグローバルy座標を返却
     *              Return the global y coordinate of the center point
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
     * @description 直前のx座標を返却
     *              Return the previous x coordinate
     *
     * @member {number}
     * @default 0
     * @public
     */
    public beforeX: number = 0;

    /**
     * @description 直前のy座標を返却
     *              Return the previous y coordinate
     *
     * @member {number}
     * @default 0
     * @public
     */
    public beforeY: number = 0;

    /**
     * @description pivot位置のx座標を返却
     *              Returns the x coordinate of the pivot position
     *
     * @member {number}
     * @default 0
     * @public
     */
    public pivotX: number = 0;

    /**
     * @description pivot位置のy座標を返却
     *              Returns the y coordinate of the pivot position
     *
     * @member {number}
     * @default 0
     * @public
     */
    public pivotY: number = 0;

    /**
     * @description ポインタームーブイベントでの移動量を返却
     *              Returns the amount of movement in the pointer move event
     *
     * @member {number}
     * @default 0
     * @public
     */
    public movementX: number = 0;

    /**
     * @description ポインタームーブイベントでの移動量を返却
     *              Returns the amount of movement in the pointer move event
     *
     * @member {number}
     * @default 0
     * @public
     */
    public movementY: number = 0;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.x          = 0;
        this.y          = 0;
        this.state      = "hide";
        this.pivot      = "middle-center";
        this.beforeX    = 0;
        this.beforeY    = 0;
        this.movementX  = 0;
        this.movementY  = 0;
        this.pivotX     = 0;
        this.pivotY     = 0;
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
        this.x          = 0;
        this.y          = 0;
        this.state      = "hide";
        this.pivot      = "middle-center";
        this.beforeX    = 0;
        this.beforeY    = 0;
        this.movementX  = 0;
        this.movementY  = 0;
        this.pivotX     = 0;
        this.pivotY     = 0;
    }
}

export const referenceSetting = new ReferenceSetting();