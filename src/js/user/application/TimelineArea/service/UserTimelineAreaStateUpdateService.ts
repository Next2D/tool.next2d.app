import { $USER_TIMELINE_AREA_STATE_KEY } from "../../../../config/Config";
import type { UserTimelineAreaStateObjectImpl } from "../../../../interface/UserTimelineAreaStateObjectImpl";

/**
 * @description ツールエリアの移動状態をLocalStorageに保存する
 *              Save the movement state of the tool area to LocalStorage
 *
 * @param  {object} object
 * @return {void}
 * @method
 * @public
 */
export const execute = (object: UserTimelineAreaStateObjectImpl): void =>
{
    localStorage.setItem($USER_TIMELINE_AREA_STATE_KEY, JSON.stringify(object));
};