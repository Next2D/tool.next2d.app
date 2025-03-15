import { execute as propertyAreaInitializeRegisterEventUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaInitializeRegisterEventUseCase";

/**
 * @description プロパティエリアの管理クラス
 *              Property area management class
 *
 * @class
 * @public
 */
class PropertyArea
{
    /**
     * @description スクロールスケールを返却
     *              Returns the scroll scale
     *
     * @member {number}
     * @default 1
     * @public
     */
    public scrollScale: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.scrollScale = 1;
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
        propertyAreaInitializeRegisterEventUseCase();
    }
}

export const propertyArea = new PropertyArea();