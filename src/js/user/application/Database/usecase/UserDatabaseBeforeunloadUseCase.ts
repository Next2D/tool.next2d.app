import { $isSocketOwner } from "@/share/application/ShareUtil";
import { execute as userDatabaseSaveUseCase } from "@/user/application/Database/usecase/UserDatabaseSaveUseCase";

/**
 * @description IndexedDbからデータ読み込みを行う
 *              Read data from IndexedDb
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: BeforeUnloadEvent): Promise<void> =>
{
    if (location.hash && !$isSocketOwner()) {
        return ;
    }

    event.preventDefault();
    event.stopPropagation();

    // 現在のデータを保存
    await userDatabaseSaveUseCase();
};