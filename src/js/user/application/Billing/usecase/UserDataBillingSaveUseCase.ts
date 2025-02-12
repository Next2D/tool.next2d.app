import type { IBillingExpireObject } from "@/interface/IBillingExpireObject";
import { execute as userDatabaseGetOpenDBRequestService } from "@/user/application/Database/service/UserDatabaseGetOpenDBRequestService";
import {
    $USER_DATABASE_BILLING_STORE_KEY,
    $USER_DATABASE_NAME
} from "@/config/Config";
import { $getExpireDate, $setExpireDate } from "../BillingUtil";
import { $BILLING_REWARD_PERIOD } from "@/config/BillingConfig";

/**
 * @description リワード広告報酬の受け取り処理関数
 *              Rewarded ad reward receipt processing function
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
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

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            // 有効期限が過去の場合は今日の日付にする
            let date = new Date($getExpireDate());
            if (date.getTime() < today.getTime()) {
                date = today;
            }

            date.setDate(date.getDate() + $BILLING_REWARD_PERIOD);

            // フォーマットをyyyy-mm-ddに変換
            const year  = date.getFullYear();
            const month = ("0" + String(date.getMonth() + 1)).slice(-2);
            const day   = ("0" + String(date.getDate())).slice(-2);

            const expireObject: IBillingExpireObject = {
                "expire": `${year}-${month}-${day}`
            };

            // 有効期限を更新
            $setExpireDate(expireObject.expire);

            // IndesdDBに保存
            store.put(
                JSON.stringify(expireObject),
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