import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalWorkSpace } from "./core/domain/model/ExternalWorkSpace";
import {
    $createWorkSpace,
    $getAllWorkSpace,
    $getCurrentWorkSpace,
    $removeWorkSpace
} from "@/core/application/CoreUtil";

/**
 * @description 外部APIの起動クラス
 *              External API invocation class
 */
export class ExternalApplication
{
    /**
     * @description 起動中のWorkSpaceのAPIオブジェクトを返却
     *              Returns the API object of the currently running WorkSpace
     *
     * @return {ExternalWorkSpace}
     * @method
     * @public
     */
    getCurrentWorkSpace (): ExternalWorkSpace
    {
        return new ExternalWorkSpace($getCurrentWorkSpace());
    }

    /**
     * @description 現在読み込まれている全てのWorkSpaceのAPIオブジェクトを配列で返却
     *              Returns an array of all currently loaded WorkSpace API objects
     *
     * @return {ExternalWorkSpace[]}
     * @method
     * @public
     */
    getAllWorkSpace (): ExternalWorkSpace[]
    {
        const workSpaces = $getAllWorkSpace();

        const externalWorkSpaces: ExternalWorkSpace[] = [];
        for (let idx = 0; idx < workSpaces.length; ++idx) {
            externalWorkSpaces.push(
                new ExternalWorkSpace(workSpaces[idx])
            );
        }

        return externalWorkSpaces;
    }

    /**
     * @description 新規のWorkSpaceを作成
     *              Create a new WorkSpace
     *
     * @return {ExternalWorkSpace}
     * @method
     * @public
     */
    createWorkSpace (): ExternalWorkSpace
    {
        return new ExternalWorkSpace($createWorkSpace());
    }

    /**
     * @description 指定したWorkSpaceを削除する
     *              Delete the specified WorkSpace
     *
     * @return {Promise}
     * @method
     * @public
     */
    async removeWorkSpace (work_space: WorkSpace): Promise<void>
    {
        await $removeWorkSpace(work_space);
    }
}