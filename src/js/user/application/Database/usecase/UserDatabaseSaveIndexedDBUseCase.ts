import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { MenuImpl } from "@/interface/MenuImpl";
import { $getMenu } from "@/menu/application/MenuUtil";
import { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { execute as userDatabaseGetOpenDBRequestService } from "../service/UserDatabaseGetOpenDBRequestService";
import { execute as workSpaceCreateSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceCreateSaveDataService";
import {
    $USER_DATABASE_NAME,
    $USER_DATABASE_STORE_KEY
} from "@/config/Config";

/**
 * @description IndexedDBにデータを保存
 *              Store data in IndexedDB.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // バイナリを生成
    const buffer = await workSpaceCreateSaveDataService();

    if (!buffer) {
        return ;
    }

    let binary = "";
    for (let idx = 0; idx < buffer.length; idx += 4096) {
        binary += String.fromCharCode(...buffer.slice(idx, idx + 4096));
    }

    const request: IDBOpenDBRequest = userDatabaseGetOpenDBRequestService();

    // 起動成功処理
    request.onsuccess = (event: Event): void =>
    {
        if (!event.target) {
            return ;
        }

        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

        const transaction: IDBTransaction = db.transaction(
            `${$USER_DATABASE_NAME}`, "readwrite"
        );

        const store: IDBObjectStore = transaction
            .objectStore(`${$USER_DATABASE_NAME}`);

        // IndesdDBに保存
        store.put(binary, $USER_DATABASE_STORE_KEY);

        transaction.oncomplete = (): void =>
        {
            // DBを終了
            db.close();

            // 進行状況を表示を終了
            const menu: MenuImpl<ProgressMenu> = $getMenu($PROGRESS_MENU_NAME);
            if (!menu) {
                return ;
            }
            menu.hide();
        };

        transaction.commit();
    };
};