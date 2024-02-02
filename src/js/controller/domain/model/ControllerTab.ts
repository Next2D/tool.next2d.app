import { execute as controllerTabInitializeRegisterEventUseCase } from "../../application/ControllerTab/usecase/ControllerTabInitializeRegisterEventUseCase";

/**
 * @description コントローラータブの管理クラス
 *              Controllers tab management class
 *
 * @class
 * @public
 */
export class ControllerTab
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
        // コントローラータブの初期起動時のイベント登録
        controllerTabInitializeRegisterEventUseCase();
    }
}

export const controllerTab = new ControllerTab();