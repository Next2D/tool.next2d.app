import { execute as toolInitializeRegisterEventService } from "../service/ToolInitializeRegisterEventService";
import { execute as toolInitializeBootService } from "../service/ToolInitializeBootService";

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
    toolInitializeRegisterEventService();

    // 各種ツールクラスを起動
    return toolInitializeBootService();
};