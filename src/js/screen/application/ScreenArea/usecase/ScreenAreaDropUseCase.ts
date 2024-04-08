import type { Instance } from "@/core/domain/model/Instance";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import {
    $FOLDER_TYPE,
    $SOUND_TYPE
} from "@/config/InstanceConfig";

/**
 * @description スクリーンエリアのアイテムドロップイベント処理関数
 *              Item drop event processing function for screen area
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: DragEvent): Promise<void> =>
{
    // 親のイベントをキャンセル
    event.preventDefault();
    event.stopPropagation();

    // メニューを非表示
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const externalTimeline = new ExternalTimeline(workSpace, workSpace.scene);
    for (let idx = 0; idx < libraryArea.selectedIds.length; ++idx) {

        const libraryId = libraryArea.selectedIds[idx];
        const instance: InstanceImpl<Instance> = workSpace.getLibrary(libraryId);
        if (!instance) {
            continue;
        }

        switch (instance.type) {

            case $SOUND_TYPE:
                break;

            case $FOLDER_TYPE:
                break;

            default:
                await externalTimeline
                    .addItemToMovieClip(0, 0, instance.getPath(workSpace));
                break;

        }
    }
};