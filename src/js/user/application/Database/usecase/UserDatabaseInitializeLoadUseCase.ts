import type { MenuImpl } from "@/interface/MenuImpl";
import type { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $createWorkSpace } from "@/core/application/CoreUtil";
import { $replace } from "@/language/application/LanguageUtil";
import { execute as userDatabaseGetOpenDBRequestService } from "../service/UserDatabaseGetOpenDBRequestService";
import { execute as workSpaceRestoreSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceRestoreSaveDataService";
import {
    $USER_DATABASE_NAME,
    $USER_DATABASE_STORE_KEY
} from "@/config/Config";

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
    return new Promise((resolve): void =>
    {
        // 進行状況を表示
        const menu: MenuImpl<ProgressMenu> = $getMenu($PROGRESS_MENU_NAME);
        if (!menu) {
            return ;
        }

        // 進行状況のテキストを更新
        menu.message = $replace("{{データベースを起動}}");

        const request: IDBOpenDBRequest = userDatabaseGetOpenDBRequestService();

        // 起動成功処理
        request.onsuccess = (event: Event): void =>
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
            dbRequest.onsuccess = (event: Event): void =>
            {
                if (!event.target) {
                    return ;
                }

                // 進行状況のテキストを更新
                menu.message = $replace("{{N2Dファイルの読み込み}}");

                const binary: string | undefined = (event.target as IDBRequest).result;
                if (binary) {

                    // 保存データを復元
                    workSpaceRestoreSaveDataService(binary)
                        .then(resolve);

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