import { execute as globalRegisterEventUseCase } from "./usecase/GlobalRegisterEventUseCase";
import { execute as globalBootPlayerService } from "./service/GlobalBootPlayerService";

/**
 * @description グローバル機能の初期起動関数
 *              Initial startup function for global functions
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // Next2D Playerを起動
    await globalBootPlayerService();

    // イベント登録
    globalRegisterEventUseCase();
};