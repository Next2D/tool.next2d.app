import { $setMouseState } from "../../ToolUtil";
import { execute as toolAreaActiveMoveService } from "../service/ToolAreaActiveMoveService";

/**
 * @description ツールエリアでマウスダウンした際の関数
 *              Function on mouse down in the tool area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // マウスの状態管理をアップに更新
    $setMouseState("up");

    // 状態更新
    toolAreaActiveMoveService(event);
};