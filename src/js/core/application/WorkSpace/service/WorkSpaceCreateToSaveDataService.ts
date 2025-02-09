import type { IInstanceSaveObject } from "@/interface/IInstanceSaveObject";
import type { IBitmapSaveObject } from "@/interface/IBitmapSaveObject";
import type { ISoundSaveObject } from "@/interface/ISoundSaveObject";
import type { IVideoSaveObject } from "@/interface/IVideoSaveObject";
import type { IMovieClipSaveObject } from "@/interface/IMovieClipSaveObject";
import type { IFolderSaveObject } from "@/interface/IFolderSaveObject";
import type { IInstance } from "@/interface/IInstance";
import type { IShapeSaveObject } from "@/interface/IShapeSaveObject";
import type { ITextSaveObject } from "@/interface/ITextSaveObject";
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
export const execute = async (save_object: IInstanceSaveObject): Promise<IInstance<any>> => {

    switch (save_object.type) {

        case $MOVIE_CLIP_TYPE:
            return new MovieClip(save_object as IMovieClipSaveObject);

        case $FOLDER_TYPE:
            return new Folder(save_object as IFolderSaveObject);

        case $BITMAP_TYPE:
            return new Bitmap(save_object as IBitmapSaveObject);

        case $VIDEO_TYPE:
        {
            const video = new Video(save_object as IVideoSaveObject);
            await video.wait();
            return video;
        }

        case $SOUND_TYPE:
        {
            const sound = new Sound(save_object as ISoundSaveObject);
            await sound.wait();
            return sound;
        }

        case $SHAPE_TYPE:
            return new Shape(save_object as IShapeSaveObject);

        case $TEXT_TYPE:
            return new Text(save_object as ITextSaveObject);

        default:
            throw new Error("This is an undefined class.");

    }
};