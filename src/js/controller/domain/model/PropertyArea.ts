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
    private _$scrollScale: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scrollScale = 1;
    }

    /**
     * @description スクロールスケールを返却
     *              Returns the scroll scale
     *
     * @member {number}
     * @public
     */
    get scrollScale (): number
    {
        return this._$scrollScale;
    }
    set scrollScale (scroll_scale: number)
    {
        this._$scrollScale = scroll_scale;
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