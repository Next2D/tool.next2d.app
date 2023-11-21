import { execute as controllerTabInitializeRegisterEventUseCase } from "../application/ControllerTab/usecase/ControllerTabInitializeRegisterEventUseCase";
/**
 * @description コントローラーエリアの初期起動関数
 *              Initial startup function of the controller area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // タブのイベントを登録
    controllerTabInitializeRegisterEventUseCase();
};