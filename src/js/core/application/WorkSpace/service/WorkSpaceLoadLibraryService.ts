import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { FolderSaveObjectImpl } from "@/interface/FolderSaveObjectImpl";
import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import type { MovieClipSaveObjectImpl } from "@/interface/MovieClipSaveObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { Folder } from "@/core/domain/model/Folder";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { Video } from "@/core/domain/model/Video";

/**
 * @description 保存データからライブラリ情報を復元
 *              Restore library information from stored data
 *
 * @param  {WorkSpace} work_space
 * @param  {array} libraries
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    libraries: InstanceSaveObjectImpl[]
): Promise<void> => {

    // 復元処理
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

            case "bitmap":
                work_space.libraries.set(
                    libraryObject.id,
                    new Bitmap(libraryObject as BitmapSaveObjectImpl)
                );
                break;

            case "video":
                {
                    const video = new Video(libraryObject as VideoSaveObjectImpl);
                    await video.wait();
                    work_space.libraries.set(
                        libraryObject.id,
                        video
                    );
                }
                break;

            default:
                throw new Error("This is an undefined class.");

        }
    }
};