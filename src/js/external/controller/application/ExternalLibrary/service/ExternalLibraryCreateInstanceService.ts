import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Instance } from "@/core/domain/model/Instance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Shape } from "@/core/domain/model/Shape";
import type { Sound } from "@/core/domain/model/Sound";
import type { Text } from "@/core/domain/model/Text";
import type { Video } from "@/core/domain/model/Video";
import type { Folder } from "@/core/domain/model/Folder";
import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { ExternalItem } from "@/external/core/domain/model/ExternalItem";
import { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import { ExternalBitmap } from "@/external/core/domain/model/ExternalBitmap";
import { ExternalMovieClip } from "@/external/core/domain/model/ExternalMovieClip";
import { ExternalShape } from "@/external/core/domain/model/ExternalShape";
import { ExternalSound } from "@/external/core/domain/model/ExternalSound";
import { ExternalVideo } from "@/external/core/domain/model/ExternalVideo";
import { ExternalText } from "@/external/core/domain/model/ExternalText";
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
 * @description 指定タイプのクラスを作成
 *              Create a class of the specified type
 *
 * @param  {WorkSpace} work_space
 * @param  {Instance} instance
 * @return {Instance}
 * @method
 * @public
 */
export const execute = <I extends Instance, E extends ExternalItem> (
    work_space: WorkSpace,
    instance: I
): E | null => {

    // タイプ別のクラスを作成
    switch (instance.type) {

        case $MOVIE_CLIP_TYPE:
            return new ExternalMovieClip(work_space, instance as unknown as MovieClip) as unknown as E;

        case $SHAPE_TYPE:
            return new ExternalShape(work_space, instance as unknown as Shape) as unknown as E;

        case $SOUND_TYPE:
            return new ExternalSound(work_space, instance as unknown as Sound) as unknown as E;

        case $TEXT_TYPE:
            return new ExternalText(work_space, instance as unknown as Text) as unknown as E;

        case $VIDEO_TYPE:
            return new ExternalVideo(work_space, instance as unknown as Video) as unknown as E;

        case $FOLDER_TYPE:
            return new ExternalFolder(work_space, instance as unknown as Folder) as unknown as E;

        case $BITMAP_TYPE:
            return new ExternalBitmap(work_space, instance as unknown as Bitmap) as unknown as E;

        default:
            return null;

    }
};