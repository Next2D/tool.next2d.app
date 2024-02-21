import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { InstanceImpl } from "@/interface/InstanceImpl";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as libraryPreviewAreaUpdateDisplayUseCase } from "@/controller/application/LibraryPreviewArea/usecase/LibraryPreviewAreaUpdateDisplayUseCase";
import { execute as libraryPreviewAreaClearDisplayService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaClearDisplayService";

/**
 * @description 親Elementのマウスダウン処理関数、Elementを選択状態に更新
 *              Mouse down processing function of parent Element, update Element to selected state
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // メニューを全て非表示に更新
    $allHideMenu();

    // 編集中なら終了
    if ($useKeyboard()) {
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const libraryId = parseInt(element.dataset.libraryId as string);
    const instance: InstanceImpl<any> | null = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    // フォルダーのインスタンスでなければ、プレビューエリアを更新
    if (instance.type !== "folder") {
        libraryPreviewAreaUpdateDisplayUseCase(instance);
    } else {
        libraryPreviewAreaClearDisplayService();
    }

    // 外部APIを起動
    const externalLibrary = new ExternalLibrary(workSpace);
    switch (true) {

        case event.altKey:
            break;

        case event.shiftKey:
            break;

        default:
            externalLibrary.selectedItem(instance.getPath(workSpace));
            break;

    }
};