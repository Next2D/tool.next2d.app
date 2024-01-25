import { execute as shareInitializeUseCase } from "./usecase/ShareInitializeUseCase";

/**
 * @description WebSocket機能の初期起動関数
 *              Initial startup function for WebSocket functions
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    shareInitializeUseCase();
};