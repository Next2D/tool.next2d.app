import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Instance } from "@/core/domain/model/Instance";
import { Sound } from "@/core/domain/model/Sound";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
    const externalLibrary = new ExternalLibrary(workSpace);

    for (let idx = 0; idx < libraryArea.selectedIds.length; idx++) {

        const libraryId = libraryArea.selectedIds[idx];
        const instance: InstanceImpl<Instance> = workSpace.getLibrary(libraryId);
        if (!instance) {
            continue;
        }

        switch (instance.type) {

            case Sound.type:
                break;

        }

        await externalLibrary
            .addItemToMovieClip(0, 0, instance.getPath(workSpace));
    }
};