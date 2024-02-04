import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description 指定のインスタンスのフォルダ階層を含むパス名を返却
 *              Returns a pathname containing the folder hierarchy of the specified instance
 *
 * @param  {WorkSpace} work_space
 * @param  {Instance} instance
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    instance: InstanceImpl<any>
): string => {

    let path = instance.name;

    // フォルダ内にあれば先祖の階層を取得
    if (instance.folderId) {

        let parent: InstanceImpl<any> = instance;

        while (parent.folderId) {

            parent = work_space.getLibrary(parent.folderId);
            if (!parent) {
                break;
            }

            path = `${parent.name}/${path}`;
        }
    }

    return path;
};