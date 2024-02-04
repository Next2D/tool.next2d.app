import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaComponent } from "../component/LibraryAreaComponent";
import { execute as libraryAreaSelectedMouseDownService } from "../service/LibraryAreaSelectedMouseDownUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { libraryArea } from "@/controller/domain/model/LibraryArea";

/**
 * @description ライブラリエリアのElementを生成してイベントを登録する
 *              Generate an Element in the library area to register events
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (!element) {
        return ;
    }

    // 既存の表示を初期化
    const children = element.children;
    while (children.length) {
        children[0].remove();
    }

    const workSpace = $getCurrentWorkSpace();
    for (const instance of workSpace.libraries.values()) {

        // rootはスキップ
        if (instance.id === 0) {
            continue;
        }

        element.insertAdjacentHTML("beforeend",
            libraryAreaComponent(instance)
        );

        // イベントを登録
        const node = element.lastElementChild as NonNullable<HTMLElement>;

        // 選択中ならstyleを更新
        if (libraryArea.selectedIds.indexOf(instance.id) > -1) {
            node.classList.add("active");
        }

        // 親Elementに選択イベントを登録
        node.addEventListener(EventType.MOUSE_DOWN,
            libraryAreaSelectedMouseDownService
        );

        console.log([node, instance]);
    }
};