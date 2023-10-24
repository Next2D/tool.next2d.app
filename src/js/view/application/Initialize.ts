import { execute as viewInitializeUseCase } from "./View/usecase/ViewInitializeUseCase";
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
    viewInitializeUseCase();
};