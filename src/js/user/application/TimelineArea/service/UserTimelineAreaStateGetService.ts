import { $USER_TIMELINE_AREA_STATE_KEY } from "@/config/Config";
import type { UserTimelineAreaStateObjectImpl } from "@/interface/UserTimelineAreaStateObjectImpl";

/**
 * @description ツールエリアの移動状態をLocalStorageから取得
 *              Get tool area movement status from LocalStorage
 *
 * @return {object}
 * @method
 * @public
 */
export const execute = (): UserTimelineAreaStateObjectImpl =>
{
    const json: string | null = localStorage.getItem($USER_TIMELINE_AREA_STATE_KEY);

    if (json) {
        return JSON.parse(json) as UserTimelineAreaStateObjectImpl;
    }

    return {
        "state": "fixed",
        "offsetLeft": 0,
        "offsetTop": 0,
        "width": 0,
        "height": 0
    };
};