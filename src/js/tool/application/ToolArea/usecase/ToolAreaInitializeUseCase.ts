import { execute as toolAreaInitializeRegisterEventUseCase } from "./ToolAreaInitializeRegisterEventUseCase";
import { execute as toolAreaInitializeBootService } from "../service/ToolAreaInitializeBootService";

/**
 * @description ツールエリアの初期起動時のユースケース
 *              Use case for initial startup of the tool area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void[]> =>
{
    // 初期起動時のイベント登録処理
    toolAreaInitializeRegisterEventUseCase();

    // 各種ツールクラスを起動
    return toolAreaInitializeBootService();
};