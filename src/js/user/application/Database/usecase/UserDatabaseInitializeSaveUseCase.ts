import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { $getAllWorkSpace } from "@/core/application/CoreUtil";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { MenuImpl } from "@/interface/MenuImpl";
import { $replace } from "@/language/application/LanguageUtil";
import { $getMenu } from "@/menu/application/MenuUtil";
import { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
// @ts-ignore
import ZlibDeflateWorker from "@/worker/ZlibDeflateWorker?worker&inline";
import { execute as userDatabaseGetOpenDBRequestService } from "../service/UserDatabaseGetOpenDBRequestService";
import {
    $USER_DATABASE_NAME,
    $USER_DATABASE_STORE_KEY
} from "@/config/Config";

/**
 * @private
 */
const worker: Worker = new ZlibDeflateWorker();

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

        // 全てのWorkSpcaceからobjectを取得
        const workSpaces: WorkSpace[] = $getAllWorkSpace();

        const objects = [];
        for (let idx = 0; idx < workSpaces.length; ++idx) {
            const workSpace: WorkSpace = workSpaces[idx];
            objects.push(workSpace.toObject());
        }

        const value = encodeURIComponent(JSON.stringify(objects));
        const buffer: Uint8Array = new Uint8Array(value.length);
        for (let idx = 0; idx < value.length; ++idx) {
            buffer[idx] = value[idx].charCodeAt(0);
        }

        // サブスレッドで圧縮処理を行う
        worker.postMessage(buffer, [buffer.buffer]);

        // 終了したらIndesdDBに保存
        worker.onmessage = (event: MessageEvent): void =>
        {
            const buffer: Uint8Array = event.data as NonNullable<Uint8Array>;

            let binary = "";
            for (let idx = 0; idx < buffer.length; idx += 4096) {
                binary += String.fromCharCode(...buffer.slice(idx, idx + 4096));
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

                store.put(binary, $USER_DATABASE_STORE_KEY);

                transaction.oncomplete = (): void =>
                {
                    db.close();
                    menu.hide();

                    reslove();
                };

                transaction.commit();
            };
        };
    });
};