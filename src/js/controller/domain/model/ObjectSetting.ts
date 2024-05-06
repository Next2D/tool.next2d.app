import { execute as objectSettingRegisterEventUseCase } from "@/controller/application/ObjectSetting/usecase/ObjectSettingRegisterEventUseCase";

/**
 * @description オブジェクト設定の管理クラス
 *              Object setting management class
 *
 * @class
 * @public
 */
class ObjectSetting
{

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
        objectSettingRegisterEventUseCase();
    }
}

export const objectSetting = new ObjectSetting();