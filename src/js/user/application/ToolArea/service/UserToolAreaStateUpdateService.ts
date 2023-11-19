import { $USER_TOOL_AREA_STATE_KEY } from "@/config/Config";
import type { UserToolAreaStateObjectImpl } from "@/interface/UserToolAreaStateObjectImpl";

/**
 * @description ツールエリアの移動状態をLocalStorageに保存する
 *              Save the movement state of the tool area to LocalStorage
 *
 * @param  {object} object
 * @return {void}
 * @method
 * @public
 */
export const execute = (object: UserToolAreaStateObjectImpl): void =>
{
    localStorage.setItem($USER_TOOL_AREA_STATE_KEY, JSON.stringify(object));
};