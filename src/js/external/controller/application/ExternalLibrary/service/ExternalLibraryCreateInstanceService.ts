import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IExternalItem } from "@/interface/IExternalItem";
import type { Instance } from "@/core/domain/model/Instance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Shape } from "@/core/domain/model/Shape";
import type { Sound } from "@/core/domain/model/Sound";
import type { Text } from "@/core/domain/model/Text";
import type { Video } from "@/core/domain/model/Video";
import type { Folder } from "@/core/domain/model/Folder";
import type { Bitmap } from "@/core/domain/model/Bitmap";
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
export const execute = <I extends Instance> (
    work_space: WorkSpace,
    instance: I
): IExternalItem<any> | null => {

    // タイプ別のクラスを作成
    switch (instance.type) {

        case $MOVIE_CLIP_TYPE:
            return new ExternalMovieClip(work_space, instance as unknown as MovieClip);

        case $SHAPE_TYPE:
            return new ExternalShape(work_space, instance as unknown as Shape);

        case $SOUND_TYPE:
            return new ExternalSound(work_space, instance as unknown as Sound);

        case $TEXT_TYPE:
            return new ExternalText(work_space, instance as unknown as Text);

        case $VIDEO_TYPE:
            return new ExternalVideo(work_space, instance as unknown as Video);

        case $FOLDER_TYPE:
            return new ExternalFolder(work_space, instance as unknown as Folder);

        case $BITMAP_TYPE:
            return new ExternalBitmap(work_space, instance as unknown as Bitmap);

        default:
            return null;

    }
};