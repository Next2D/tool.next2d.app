import { execute as referenceSettingInitializeRegisterEventUseCase } from "@/controller/application/ReferenceSetting/usecase/ReferenceSettingInitializeRegisterEventUseCase";

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
     * @description 中心点の表示状態を返却
     *              Return the display state of the center point
     *
     * @member {string}
     * @default "hide"
     * @public
     */
    public state: "hide" | "show";

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.x = 0;
        this.y = 0;

        this.state = "hide";
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
}

export const referenceSetting = new ReferenceSetting();