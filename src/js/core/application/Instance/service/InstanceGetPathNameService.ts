import type { Instance } from "@/core/domain/model/Instance";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description 指定のインスタンスのフォルダ階層を含むパス名を返却
 *              Returns a pathname containing the folder hierarchy of the specified instance
 *
 * @param  {WorkSpace} work_space
 * @param  {I} instance
 * @return {string}
 * @method
 * @public
 */
export const execute = <I extends Instance> (
    work_space: WorkSpace,
    instance: I
): string => {

    let path = instance.name;

    // フォルダ内にあれば先祖の階層を取得
    if (instance.folderId) {

        let parent = instance;
        while (parent.folderId) {

            parent = work_space.getLibrary(parent.folderId) as  I;
            if (!parent) {
                break;
            }

            path = `${parent.name}/${path}`;
        }
    }

    return path;
};