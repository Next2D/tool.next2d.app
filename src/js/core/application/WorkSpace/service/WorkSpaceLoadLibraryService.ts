import { Folder } from "@/core/domain/model/Folder";
import { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { FolderSaveObjectImpl } from "@/interface/FolderSaveObjectImpl";
import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import type { MovieClipSaveObjectImpl } from "@/interface/MovieClipSaveObjectImpl";

/**
 * @description 保存データからライブラリ情報を復元
 *              Restore library information from stored data
 *
 * @param  {WorkSpace} work_space
 * @param  {array} libraries
 * @return {vpod}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    libraries: InstanceSaveObjectImpl[]
): void => {

    for (let idx: number = 0; idx < libraries.length; ++idx) {

        const libraryObject = libraries[idx];

        // rootの読み込み
        if (libraryObject.id === 0) {
            work_space.root.load(libraryObject as MovieClipSaveObjectImpl);
            continue;
        }

        switch (libraryObject.type) {

            case "container":
                work_space.libraries.set(
                    libraryObject.id,
                    new MovieClip(libraryObject as MovieClipSaveObjectImpl)
                );
                break;

            case "folder":
                work_space.libraries.set(
                    libraryObject.id,
                    new Folder(libraryObject as FolderSaveObjectImpl)
                );
                break;

            default:
                throw new Error("This is an undefined class.");

        }
    }
};