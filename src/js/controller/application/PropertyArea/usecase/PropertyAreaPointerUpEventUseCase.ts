import { $setMouseState } from "../PropertyAreaUtil";

/**
 * @description プロパティエリアのマウスアップイベント
 *              Mouse-up event in property area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    event.stopPropagation();
    event.preventDefault();

    // マウスの状態管理をアップに更新
    $setMouseState("up");
};