import { $isSocketOwner, $useSocket } from "@/share/ShareUtil";
import { execute as userDatabaseSaveIndexedDBUseCase } from "./UserDatabaseSaveIndexedDBUseCase";

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
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 予約の取り消し
    clearTimeout(timerId);

    // 画面共有で、オーナーでない場合は保存はしない
    if ($useSocket() && !$isSocketOwner()) {
        return ;
    }

    // 5秒後に保存処理を実行
    timerId = window.setTimeout(async (): Promise<void> =>
    {
        await userDatabaseSaveIndexedDBUseCase();
    }, 5000);
};