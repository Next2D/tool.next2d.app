import { execute as userDatabaseSaveIndexedDBUseCase } from "./UserDatabaseSaveIndexedDBUseCase";

/**
 * @type {number}
 * @default -1
 * @private
 */
let timerId: number = -1;

export const execute = (): void =>
{
    // 予約の取り消し
    clearTimeout(timerId);

    // 5秒後に保存処理を実行
    timerId = window.setTimeout(async (): Promise<void> =>
    {
        await userDatabaseSaveIndexedDBUseCase();
    }, 5000);
};