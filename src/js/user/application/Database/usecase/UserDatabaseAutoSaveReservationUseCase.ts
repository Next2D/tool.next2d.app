import { $isSocketOwner, $useSocket } from "@/share/ShareUtil";
import { execute as userDatabaseSaveIndexedDBUseCase } from "./UserDatabaseSaveIndexedDBUseCase";
import { execute as userDatabaseBeforeUnLoadEventService } from "../service/UserDatabaseBeforeUnLoadEventService";
import {
    $isSaving,
    $startSaving
} from "../DatabaseUtil";

/**
 * @type {number}
 * @default -1
 * @private
 */
let timerId: number = -1;

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
    // 予約の取り消し
    clearTimeout(timerId);

    // 画面共有で、オーナーでない場合は保存はしない
    if ($useSocket() && !$isSocketOwner()) {
        return ;
    }

    await userDatabaseSaveIndexedDBUseCase();
};