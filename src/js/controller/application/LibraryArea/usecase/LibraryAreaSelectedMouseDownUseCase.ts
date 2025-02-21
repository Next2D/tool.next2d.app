import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as libraryPreviewAreaUpdateDisplayUseCase } from "@/controller/application/LibraryPreviewArea/usecase/LibraryPreviewAreaUpdateDisplayUseCase";
import { execute as libraryPreviewAreaClearDisplayService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaClearDisplayService";
import { execute as libraryAreaAltSelectedUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaAltSelectedUseCase";
import { execute as libraryAreaShiftSelectedUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaShiftSelectedUseCase";
import { execute as libraryAreaRegisterPointerEventUseCase } from "./LibraryAreaRegisterPointerEventUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { execute as libraryMenuShowUseCase } from "@/menu/application/LibraryMenu/usecase/LibraryMenuShowUseCase";
import {
    $FOLDER_TYPE,
    $MOVIE_CLIP_TYPE
} from "@/config/InstanceConfig";
import {
    $getEditingElement,
    $setEditingElement
} from "@/global/GlobalUtil";

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
    if (event.button !== 0) {
        return ;
    }

    // メニューを全て非表示に更新
    $allHideMenu();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 編集中なら終了
    const libraryId = parseInt(element.dataset.libraryId as string);
    if ($useKeyboard()) {
        const editingElement = $getEditingElement();
        if (editingElement) {
            editingElement.blur();
            $setEditingElement(null);
        }
    }

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
    const instance  = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    // フォルダーのインスタンスでなければ、プレビューエリアを更新
    if (instance.type !== $FOLDER_TYPE) {
        await libraryPreviewAreaUpdateDisplayUseCase(instance);
    } else {
        libraryPreviewAreaClearDisplayService();
    }

    // スクリーンへの移動イベントを登録
    if (instance.type === $MOVIE_CLIP_TYPE) {
        if (!(instance as unknown as MovieClip).active) {
            libraryAreaRegisterPointerEventUseCase(event, element);
        }
    } else {
        libraryAreaRegisterPointerEventUseCase(event, element);
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