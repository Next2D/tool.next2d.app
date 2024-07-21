import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import type { MovieClipSaveObjectImpl } from "@/interface/MovieClipSaveObjectImpl";
import type { FolderSaveObjectImpl } from "@/interface/FolderSaveObjectImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import type { TextSaveObjectImpl } from "@/interface/TextSaveObjectImpl";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { Folder } from "@/core/domain/model/Folder";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { Video } from "@/core/domain/model/Video";
import { Sound } from "@/core/domain/model/Sound";
import { Shape } from "@/core/domain/model/Shape";
import { Text } from "@/core/domain/model/Text";
import {
    $BITMAP_TYPE,
    $FOLDER_TYPE,
    $MOVIE_CLIP_TYPE,
    $SHAPE_TYPE,
    $SOUND_TYPE,
    $TEXT_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

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

        case $MOVIE_CLIP_TYPE:
            return new MovieClip(save_object as MovieClipSaveObjectImpl);

        case $FOLDER_TYPE:
            return new Folder(save_object as FolderSaveObjectImpl);

        case $BITMAP_TYPE:
            return new Bitmap(save_object as BitmapSaveObjectImpl);

        case $VIDEO_TYPE:
        {
            const video = new Video(save_object as VideoSaveObjectImpl);
            await video.wait();
            return video;
        }

        case $SOUND_TYPE:
        {
            const sound = new Sound(save_object as SoundSaveObjectImpl);
            await sound.wait();
            return sound;
        }

        case $SHAPE_TYPE:
            return new Shape(save_object as ShapeSaveObjectImpl);

        case $TEXT_TYPE:
            return new Text(save_object as TextSaveObjectImpl);

        default:
            throw new Error("This is an undefined class.");

    }
};