import { $USER_TOOL_AREA_STATE_KEY } from "../../../config/Config";
import type { UserToolAreaStateObjectImpl } from "../../../interface/UserToolAreaStateObjectImpl";

/**
 * @description ツールエリアの移動状態をLocalStorageから取得
 *              Get tool area movement status from LocalStorage
 *
 * @return {object}
 * @method
 * @public
 */
export const execute = (): UserToolAreaStateObjectImpl =>
{
    const json: string | null = localStorage.getItem($USER_TOOL_AREA_STATE_KEY);

    if (json) {
        return JSON.parse(json) as UserToolAreaStateObjectImpl;
    }

    return {
        "state": "fixed",
        "offsetLeft": 0,
        "offsetTop": 0
    };
};