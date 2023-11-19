import { $getAllWorkSpace } from "@/core/application/CoreUtil";
import { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description IndexedDBにデータを保存
 *              Store data in IndexedDB.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 全てのWorkSpcaceからobjectを取得
    const workSpaces: WorkSpace[] = $getAllWorkSpace();

    const objects = [];
    for (let idx = 0; idx < workSpaces.length; ++idx) {
        const workSpace: WorkSpace = workSpaces[idx];
        objects.push(workSpace.toObject());
    }

    const saveData = {
        "object": JSON.stringify(objects),
        "type": "local"
    };

    console.log(saveData);
};