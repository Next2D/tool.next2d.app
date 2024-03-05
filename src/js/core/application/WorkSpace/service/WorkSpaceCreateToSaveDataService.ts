import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import type { MovieClipSaveObjectImpl } from "@/interface/MovieClipSaveObjectImpl";
import type { FolderSaveObjectImpl } from "@/interface/FolderSaveObjectImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { Folder } from "@/core/domain/model/Folder";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { Video } from "@/core/domain/model/Video";
import { Sound } from "@/core/domain/model/Sound";

/**
 * @description セーブオブジェクトから各種インスタンスオブジェクトを作成
 *              Create various instance objects from saved objects
 *
 * @return {Instance}
 * @method
 * @public
 */
export const execute = async (save_object: InstanceSaveObjectImpl): Promise<InstanceImpl<any>> => {

    switch (save_object.type) {

        case "container":
            return new MovieClip(save_object as MovieClipSaveObjectImpl);

        case "folder":
            return new Folder(save_object as FolderSaveObjectImpl);

        case "bitmap":
            return new Bitmap(save_object as BitmapSaveObjectImpl);

        case "video":
        {
            const video = new Video(save_object as VideoSaveObjectImpl);
            await video.wait();
            return video;
        }

        case "sound":
        {
            const sound = new Sound(save_object as SoundSaveObjectImpl);
            await sound.wait();
            return sound;
        }

        default:
            throw new Error("This is an undefined class.");

    }
};