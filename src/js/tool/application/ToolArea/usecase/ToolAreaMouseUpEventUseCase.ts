import { $setMouseState } from "../../ToolUtil";
import { execute as toolAreaActiveMoveService } from "../service/ToolAreaActiveWindowMoveService";

/**
 * @description ツールエリアでマウスアップした時の処理
 *              Processing when mouse is up in the tool area
 *
 * @params {PointerEvent} event
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