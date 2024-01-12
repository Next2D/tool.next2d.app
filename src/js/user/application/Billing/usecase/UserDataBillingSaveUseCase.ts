import { execute as userDatabaseGetOpenDBRequestService } from "@/user/application/Database/service/UserDatabaseGetOpenDBRequestService";
import {
    $USER_DATABASE_BILLING_STORE_KEY,
    $USER_DATABASE_NAME
} from "@/config/Config";
import { $getExpireDate } from "../BillingUtil";
import { $BILLING_REWARD_PERIOD } from "@/config/BillingConfig";

/**
 * @description リワード広告報酬の受け取り処理関数
 *              Rewarded ad reward receipt processing function
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    return new Promise((reslove): void =>
    {
        const request: IDBOpenDBRequest = userDatabaseGetOpenDBRequestService();

        request.onsuccess = (event: Event): void =>
        {
            if (!event.target) {
                return reslove();
            }

            const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

            const transaction: IDBTransaction = db.transaction(
                `${$USER_DATABASE_NAME}`, "readwrite"
            );

            const store: IDBObjectStore = transaction.objectStore(`${$USER_DATABASE_NAME}`);

            // 現在の有効期限のデータにプラスしてIndexedDBを更新する
            const date = new Date($getExpireDate());
            date.setDate(date.getDate() + $BILLING_REWARD_PERIOD);

            // フォーマットをyyyy-mm-ddに変換
            const year  = date.getFullYear();
            const month = ("0" + String(date.getMonth() + 1)).slice(-2);
            const day   = ("0" + String(date.getDate())).slice(-2);

            // IndesdDBに保存
            store.put(
                JSON.stringify({ "expire": `${year}-${month}-${day}` }),
                $USER_DATABASE_BILLING_STORE_KEY
            );

            transaction.oncomplete = (): void =>
            {
                // DBを終了
                db.close();

                reslove();
            };

            transaction.commit();
        };
    });
};