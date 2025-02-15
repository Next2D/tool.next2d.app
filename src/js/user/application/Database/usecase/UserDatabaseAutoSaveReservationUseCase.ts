import { $isSocketOwner, $useSocket } from "@/share/ShareUtil";
import { execute as userDatabaseSaveIndexedDBUseCase } from "./UserDatabaseSaveIndexedDBUseCase";

/**
 * @type {number}
 * @private
 */
let timerId: NodeJS.Timeout;

/**
 * @description 現在のプロジェクトを自動保存予約
 *              Reserve automatic saving of the current project
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // 画面共有で、オーナーでない場合は保存はしない
    if ($useSocket() && !$isSocketOwner()) {
        return ;
    }

    // 予約の取り消し
    clearTimeout(timerId);
    timerId = setTimeout(userDatabaseSaveIndexedDBUseCase, 3000);
};