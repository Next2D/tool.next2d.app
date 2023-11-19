import { execute as toolAreaInitializeRegisterEventUseCase } from "./ToolAreaInitializeRegisterEventUseCase";
import { execute as toolAreaInitializeSetActiveStateUseCase } from "./ToolAreaInitializeSetActiveStateUseCase";
import { execute as toolAreaInitializeBootService } from "../service/ToolAreaInitializeBootService";
import { $TOOL_PREFIX } from "@/config/ToolConfig";

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
    const element: HTMLElement | null = document.getElementById($TOOL_PREFIX);
    if (element) {
        // 初期起動時のイベント登録処理
        toolAreaInitializeRegisterEventUseCase(element);

        // 初期起動時に保存データから移動状態を再構成
        toolAreaInitializeSetActiveStateUseCase(element);
    }

    // 各種ツールクラスを起動
    return toolAreaInitializeBootService();
};