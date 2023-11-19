import { execute as userDatabaseBeforeunloadUseCase } from "@/user/application/Database/usecase/UserDatabaseBeforeunloadUseCase";

/**
 * @description ユーザー固有情報の初期起動関数
 *              Initial startup function for user-specific information
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        // 画面を閉じる時に強制的にデータ保存を実行する
        window.addEventListener("beforeunload", userDatabaseBeforeunloadUseCase);

        resolve();
    });
};