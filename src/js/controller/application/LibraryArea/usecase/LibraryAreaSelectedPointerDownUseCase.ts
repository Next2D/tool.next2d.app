import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as libraryPreviewAreaUpdateDisplayUseCase } from "@/controller/application/LibraryPreviewArea/usecase/LibraryPreviewAreaUpdateDisplayUseCase";
import { execute as libraryPreviewAreaClearDisplayService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaClearDisplayService";
import { execute as libraryAreaAltSelectedUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaAltSelectedUseCase";
import { execute as libraryAreaShiftSelectedUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaShiftSelectedUseCase";
import { execute as libraryAreaRegisterPointerEventUseCase } from "./LibraryAreaRegisterPointerEventUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { execute as libraryMenuShowUseCase } from "@/menu/application/LibraryMenu/usecase/LibraryMenuShowUseCase";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { $setScrollTop } from "../LibraryAreaUtil";
import {
    $FOLDER_TYPE,
    $MOVIE_CLIP_TYPE
} from "@/config/InstanceConfig";

/**
 * @description 親Elementのマウスダウン処理関数、Elementを選択状態に更新
 *              Mouse down processing function of parent Element, update Element to selected state
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // メニューを全て非表示に更新
    $allHideMenu();

    // 編集中なら終了
    $setEditingElement(null);

    // 親のイベントを中止
    event.stopPropagation();

    if (event.pointerType === "touch") {
        $activeTouchPointers.add(event.pointerId);
    }

    // タッチポイントが2つ以上ならライブラリメニューを表示
    if ($activeTouchPointers.size > 1) {
        libraryMenuShowUseCase(event);
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const libraryId = parseInt(element.dataset.libraryId as string);
    const instance  = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    const listBoxElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (!listBoxElement) {
        return ;
    }

    // 移動前のスクロール位置を保存
    $setScrollTop(listBoxElement.scrollTop);

    // フォルダーのインスタンスでなければ、プレビューエリアを更新
    if (instance.type !== $FOLDER_TYPE) {
        await libraryPreviewAreaUpdateDisplayUseCase(instance);
    } else {
        libraryPreviewAreaClearDisplayService();
    }

    // スクリーンへの移動イベントを登録
    if (instance.type === $MOVIE_CLIP_TYPE) {
        if (!(instance as unknown as MovieClip).active) {
            libraryAreaRegisterPointerEventUseCase(event, element, workSpace.scene);
        }
    } else {
        libraryAreaRegisterPointerEventUseCase(event, element, workSpace.scene);
    }

    // 外部APIを起動
    switch (true) {

        case event.altKey || event.metaKey:
            libraryAreaAltSelectedUseCase(libraryId);
            break;

        case event.shiftKey:
            libraryAreaShiftSelectedUseCase(libraryId);
            break;

        default:
            // 未選択時は選択処理を実行
            if (libraryArea.selectedIds.indexOf(libraryId) === -1) {
                const externalLibrary = new ExternalLibrary(workSpace);
                externalLibrary.selectedItem(instance.getPath(workSpace));
            }
            break;

    }
};