import { execute as stageSettingInitializeRegisterEventUseCase } from "@/controller/application/StageSetting/usecase/StageSettingInitializeRegisterEventUseCase";

/**
 * @description ステージ設定の管理クラス
 *              Management class for stage setup
 *
 * @class
 * @public
 */
class StageSetting
{
    /**
     * @description ステージの高さ幅のロック設定を返却
     *              Return lock setting for stage height and width
     *
     * @member {boolean}
     * @default false
     * @public
     */
    public lock: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.lock = false;
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
        stageSettingInitializeRegisterEventUseCase();
    }
}

export const stageSetting = new StageSetting();