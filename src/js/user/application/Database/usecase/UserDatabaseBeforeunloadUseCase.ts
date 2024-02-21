import { $isSocketOwner } from "@/share/ShareUtil";
import { execute as userDatabaseSaveShowModalUseCase } from "@/user/application/Database/usecase/UserDatabaseSaveShowModalUseCase";

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

    // 他のイベントを中止
    event.preventDefault();
    event.stopPropagation();

    // 現在のデータを保存
    await userDatabaseSaveShowModalUseCase();
};