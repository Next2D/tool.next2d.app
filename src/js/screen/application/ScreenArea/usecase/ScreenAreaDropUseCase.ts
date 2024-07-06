import type { InstanceImpl } from "@/interface/InstanceImpl";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import {
    $FOLDER_TYPE,
    $SOUND_TYPE
} from "@/config/InstanceConfig";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";
import { ExternalSoundArea } from "@/external/controller/domain/model/ExternalSoundArea";

/**
 * @description スクリーンエリアのアイテムドロップイベント処理関数
 *              Item drop event processing function for screen area
 *
 * @param  {number} client_x
 * @param  {number} client_y
 * @return {void}
 * @method
 * @public
 */
export const execute = async (client_x: number, client_y: number): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    for (let idx = 0; idx < libraryArea.selectedIds.length; ++idx) {

        const libraryId = libraryArea.selectedIds[idx];
        const instance: InstanceImpl<any> = workSpace.getLibrary(libraryId);
        if (!instance) {
            continue;
        }

        switch (instance.type) {

            case $SOUND_TYPE:
                {
                    const externalSoundArea = new ExternalSoundArea(workSpace, movieClip);
                    externalSoundArea.addSound(
                        movieClip.currentFrame,
                        instance.getPath(workSpace)
                    );
                }
                break;

            case $FOLDER_TYPE:
                break;

            default:
                {
                    const externalTimeline = new ExternalTimeline(workSpace, movieClip);
                    const bounds = instance.getRawBounds();
                    if (!bounds) {
                        continue;
                    }

                    const width  = Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
                    const height = Math.ceil(Math.abs(bounds.yMax - bounds.yMin));

                    const x = (client_x - $getScreenOffsetLeft() - bounds.xMin - width / 2) / workSpace.scale;
                    const y = (client_y - $getScreenOffsetTop() - bounds.yMin - height / 2) / workSpace.scale;
                    await externalTimeline
                        .addItemToMovieClip(x, y, instance.getPath(workSpace));
                }
                break;

        }
    }
};