import type { WorkSpaceSaveObjectImpl } from "@/interface/WorkSpaceSaveObjectImpl";

/**
 * @description ワークスペースデータのマイグレーション
 *              Workspace data migration
 *
 * @param  {array} work_space_objects
 * @return {array}
 * @method
 * @public
 */
export const execute = (
    work_space_objects: WorkSpaceSaveObjectImpl[]
): WorkSpaceSaveObjectImpl[] => {

    // バージョン違いのデータを現在のバージョンの仕様に変換
    for (let idx = 0; idx < work_space_objects.length; ++idx) {
        const workSpaceObject = work_space_objects[idx];
        console.log(workSpaceObject);
    }

    return work_space_objects;
};