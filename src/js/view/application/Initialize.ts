import { execute as viewInitializeRegisterEventUseCase } from "./View/usecase/ViewInitializeRegisterEventUseCase";
/**
 * @description Viewコンテナの初期起動関数
 *              Initial startup function of the View container
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 初期起動時のユースケース
    viewInitializeRegisterEventUseCase();
};