import { execute as colorSettingInitializeRegisterEventUseCase } from "@/controller/application/ColorSetting/usecase/ColorSettingInitializeRegisterEventUseCase";

/**
 * @description カラー設定クラス
 *              Color setting class
 *
 * @class
 * @public
 */
class ColorSetting
{
    /**
     * @description 変更前の値を返却
     *              Return the value before change
     *
     * @member {number}
     * @default 0
     * @public
     */
    beforeValue: number = 0;

    /**
     * @description 現在の値を返却
     *              Return the current value
     *
     * @member {number}
     * @default 0
     * @public
     */
    value: number = 0;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.beforeValue = 0;
        this.value = 0;
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
        colorSettingInitializeRegisterEventUseCase();
    }
}

export const colorSetting = new ColorSetting();