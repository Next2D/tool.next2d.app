import { $setMouseState } from "../../ToolUtil";

/**
 * @description ツールエリアでマウスアップした時の処理
 *              Processing when mouse is up in the tool area
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // マウスの状態管理をアップに更新
    $setMouseState("up");
};