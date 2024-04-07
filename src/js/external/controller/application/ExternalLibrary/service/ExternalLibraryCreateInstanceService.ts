import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
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
} from "@/config/InstanceCOnfig";

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
export const execute = (
    work_space: WorkSpace,
    instance: InstanceImpl<any>
): InstanceImpl<any> | null => {

    // タイプ別のクラスを作成
    switch (instance.type) {

        case $MOVIE_CLIP_TYPE:
            return new ExternalMovieClip(work_space, instance);

        case $SHAPE_TYPE:
            return new ExternalShape(work_space, instance);

        case $SOUND_TYPE:
            return new ExternalSound(work_space, instance);

        case $TEXT_TYPE:
            return new ExternalText(work_space, instance);

        case $VIDEO_TYPE:
            return new ExternalVideo(work_space, instance);

        case $FOLDER_TYPE:
            return new ExternalFolder(work_space, instance);

        case $BITMAP_TYPE:
            return new ExternalBitmap(work_space, instance);

        default:
            return null;

    }
};