import type { MenuImpl } from "@/interface/MenuImpl";
import type { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $createWorkSpace, $registerWorkSpace } from "@/core/application/CoreUtil";
import { execute as userDatabaseGetOpenDBRequestService } from "../service/UserDatabaseGetOpenDBRequestService";
// @ts-ignore
import ZlibInflateWorker from "@/worker/ZlibInflateWorker?worker&inline";
import {
    $USER_DATABASE_NAME,
    $USER_DATABASE_STORE_KEY
} from "@/config/Config";
import { WorkSpaceSaveObjectImpl } from "@/interface/WorkSpaceSaveObjectImpl";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $replace } from "@/language/application/LanguageUtil";

/**
 * @private
 */
const worker: Worker = new ZlibInflateWorker();

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

                const binary: string | undefined = (event.target as IDBRequest).result;
                if (binary) {

                    // 保存データがあれば復元
                    const length: number = binary.length;
                    const buffer: Uint8Array = new Uint8Array(length);
                    for (let idx: number = 0; idx < length; ++idx) {
                        buffer[idx] = binary.charCodeAt(idx) & 0xff;
                    }

                    worker.postMessage(buffer, [buffer.buffer]);

                    worker.onmessage = (event: MessageEvent): void =>
                    {
                        // 進行状況のテキストを更新
                        menu.message = $replace("{{N2Dファイルの読み込み}}");

                        let value: string = "";

                        const buffer: Uint8Array = event.data as NonNullable<Uint8Array>;
                        for (let idx: number = 0; idx < buffer.length; idx += 4096) {
                            value += String.fromCharCode(...buffer.slice(idx, idx + 4096));
                        }

                        const workSpaceObjects: WorkSpaceSaveObjectImpl[] = JSON.parse(decodeURIComponent(value));
                        for (let idx: number = 0; idx < workSpaceObjects.length; ++idx) {

                            const workSpace = new WorkSpace();
                            workSpace.load(workSpaceObjects[idx]);

                            $registerWorkSpace(workSpace);
                        }

                        resolve();
                    };

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