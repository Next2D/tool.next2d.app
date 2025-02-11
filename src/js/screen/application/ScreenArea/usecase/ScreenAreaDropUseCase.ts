import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $FOLDER_TYPE,
    $SOUND_TYPE
} from "@/config/InstanceConfig";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";
import { ExternalSoundArea } from "@/external/controller/domain/model/ExternalSoundArea";
import { execute as timelineAreaAddItemToMovieClipService } from "@/timeline/application/TimelineArea/service/TimelineAreaAddItemToMovieClipService";

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
        const instance = workSpace.getLibrary(libraryId);
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
                // TODO
                break;

            default:
                {
                    // 設置するアイテムの実際の表示範囲を取得
                    const bounds = instance.getRawBounds();
                    if (!bounds) {
                        continue;
                    }

                    // 設置するアイテムの中心座標を計算
                    const centerX = Math.abs(bounds.xMax - bounds.xMin) / 2;
                    const centerY = Math.abs(bounds.yMax - bounds.yMin) / 2;

                    // 親のMovieClipと拡大・縮小を考慮した補正座標を計算
                    const offsetX = $getScreenOffsetLeft() + (bounds.xMin + centerX) * workSpace.scale;
                    const offsetY = $getScreenOffsetTop()  + (bounds.yMin + centerY) * workSpace.scale;

                    // 指定座標にアイテムを配置
                    await timelineAreaAddItemToMovieClipService(
                        client_x - offsetX,
                        client_y - offsetY,
                        instance.getPath(workSpace)
                    );
                }
                break;

        }
    }
};