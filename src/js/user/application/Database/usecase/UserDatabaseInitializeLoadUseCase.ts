import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { ProgressMenu } from "../../../../menu/domain/model/ProgressMenu";
import { $PROGRESS_MENU_NAME } from "../../../../config/MenuConfig";
import { $getMenu } from "../../../../menu/application/MenuUtil";
import { $replace } from "../../../../language/application/LanguageUtil";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { execute as userDatabaseGetOpenDBRequestService } from "../service/UserDatabaseGetOpenDBRequestService";
import {
    $USER_DATABASE_NAME,
    $USER_DATABASE_STORE_KEY
} from "../../../../config/Config";

/**
 * @description IndexedDbからデータ読み込みを行う
 *              Read data from IndexedDb
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    return new Promise((resolve) =>
    {
        // 進行状況を表示
        const menu: MenuImpl<ProgressMenu> = $getMenu($PROGRESS_MENU_NAME);
        if (menu) {
            // 進行状況のテキストを更新
            menu.message = $replace("{{データベースを起動}}");
        }

        const request: IDBOpenDBRequest = userDatabaseGetOpenDBRequestService();

        // 起動成功処理
        request.onsuccess = (event: Event) =>
        {
            if (!event.target) {
                return ;
            }

            const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

            const transaction: IDBTransaction = db.transaction(
                `${$USER_DATABASE_NAME}`, "readonly"
            );

            const store: IDBObjectStore = transaction.objectStore(`${$USER_DATABASE_NAME}`);

            const dbRequest: IDBRequest<any> = store.get(`${$USER_DATABASE_STORE_KEY}`);
            dbRequest.onsuccess = (event: Event) =>
            {
                if (!event.target) {
                    return ;
                }

                const binary: any = (event.target as IDBRequest).result;
                if (binary) {
                    // TODO
                } else {

                    // 新規のWorkSpaceを起動
                    $createWorkSpace();

                    resolve();
                }

                db.close();
            };
        };
    });
};