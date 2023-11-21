import { execute as stageSettingInitializeRegisterEventUseCase } from "../../application/StageSetting/usecase/StageSettingInitializeRegisterEventUseCase";

/**
 * @description ステージ設定の管理クラス
 *              Management class for stage setup
 *
 * @class
 * @public
 */
export class StageSetting
{
    private _$lock: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$lock = false;
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
        // ステージ設定の初期起動時のイベント登録
        stageSettingInitializeRegisterEventUseCase();
    }

    /**
     * @description ステージの高さ幅のロック設定を返却
     *              Return lock setting for stage height and width
     *
     * @member {boolean}
     * @public
     */
    get lock (): boolean
    {
        return this._$lock;
    }
    set lock (lock: boolean)
    {
        this._$lock = lock;
    }
}