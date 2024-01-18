import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { MenuImpl } from "@/interface/MenuImpl";
import { $replace } from "@/language/application/LanguageUtil";
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
export const execute = (): Promise<void> =>
{
    return new Promise((reslove): void =>
    {
        // 進行状況を表示
        const menu: MenuImpl<ProgressMenu> = $getMenu($PROGRESS_MENU_NAME);
        if (!menu) {
            return reslove();
        }

        // 進行状況のテキストを更新
        menu.show();
        menu.message = $replace("{{データを圧縮中}}");

        // バイナリを生成
        workSpaceCreateSaveDataService()
            .then((binary: string): void =>
            {
                if (!binary) {
                    return reslove();
                }

                // 進行状況のテキストを更新
                menu.message = $replace("{{データベースを起動}}");

                const request: IDBOpenDBRequest = userDatabaseGetOpenDBRequestService();

                // 起動成功処理
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

                    // IndesdDBに保存
                    store.put(binary, $USER_DATABASE_STORE_KEY);

                    transaction.oncomplete = (): void =>
                    {
                        // メニュー表示を終了
                        menu.hide();

                        // DBを終了
                        db.close();

                        reslove();
                    };

                    transaction.commit();
                };
            });
    });
};