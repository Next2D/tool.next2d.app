import {
    $PREFIX,
    $USER_DATABASE_NAME
} from "@/config/Config";

/**
 * @description 全ての機能が利用可能かの情報を返す
 *              Returns information on whether all functions are available
 *
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (): IDBOpenDBRequest =>
{
    const request = indexedDB.open(`${$PREFIX}@${$USER_DATABASE_NAME}`);

    // Animation Toolに始めてアクセスした場合はStoreを作成
    request.addEventListener("upgradeneeded", (event: Event): void =>
    {
        if (!event.target) {
            return ;
        }

        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(`${$USER_DATABASE_NAME}`)) {
            db.createObjectStore(`${$USER_DATABASE_NAME}`);
        }
    });

    return request;
};