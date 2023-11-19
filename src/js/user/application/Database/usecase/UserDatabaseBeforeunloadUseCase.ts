import { execute as userDatabaseInitializeSaveUseCase } from "@/user/application/Database/usecase/UserDatabaseInitializeSaveUseCase";

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
    event.preventDefault();
    event.stopPropagation();

    event.returnValue = "Saving data...";

    // 現在のデータを保存
    await userDatabaseInitializeSaveUseCase();
};