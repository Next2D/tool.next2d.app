import { $USER_TIMELINE_AREA_STATE_KEY } from "../../../../config/Config";
import type { UserAreaStateObjectImpl } from "../../../../interface/UserAreaStateObjectImpl";

/**
 * @description ツールエリアの移動状態をLocalStorageから取得
 *              Get tool area movement status from LocalStorage
 *
 * @return {object}
 * @method
 * @public
 */
export const execute = (): UserAreaStateObjectImpl =>
{
    const json: string | null = localStorage.getItem($USER_TIMELINE_AREA_STATE_KEY);

    if (json) {
        return JSON.parse(json) as UserAreaStateObjectImpl;
    }

    return {
        "state": "fixed",
        "offsetLeft": 0,
        "offsetTop": 0
    };
};