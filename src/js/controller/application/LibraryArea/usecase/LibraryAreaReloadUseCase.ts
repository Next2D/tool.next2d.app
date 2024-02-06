import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaComponent } from "../component/LibraryAreaComponent";
import { execute as libraryAreaSelectedMouseDownService } from "./LibraryAreaSelectedMouseDownUseCase";
import { execute as libraryAreaArrowIconMouseDownEventService } from "../service/LibraryAreaArrowIconMouseDownEventService";
import { execute as libraryAreaFolderIconMouseDownEventService } from "../service/LibraryAreaFolderIconMouseDownEventService";
import { execute as libraryAreaInstanceNameMouseDownEventUseCase } from "./LibraryAreaInstanceNameMouseDownEventUseCase";
import { execute as libraryAreaInstanceNameKeyPressEventService } from "../service/LibraryAreaInstanceNameKeyPressEventService";
import { execute as libraryAreaInstanceNameFocusOutEventUseCase } from "./LibraryAreaInstanceNameFocusOutEventUseCase";
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

        // フォルダ時はアローアイコンにイベントを登録
        if (instance.type === "folder") {
            const icons = node.getElementsByTagName("i");
            if (icons.length) {

                const arrowIcon = icons[0] as NonNullable<HTMLElement>;
                arrowIcon.addEventListener(EventType.MOUSE_DOWN,
                    libraryAreaArrowIconMouseDownEventService
                );

                // フォルダアイコンにイベントを登録
                const folderIcon = icons[1] as NonNullable<HTMLElement>;
                folderIcon.addEventListener(EventType.MOUSE_DOWN,
                    libraryAreaFolderIconMouseDownEventService
                );
            }
        }

        const spans = node.getElementsByTagName("span");

        const nameElement = spans[0] as NonNullable<HTMLElement>;
        nameElement.addEventListener(EventType.MOUSE_DOWN,
            libraryAreaInstanceNameMouseDownEventUseCase
        );

        nameElement.addEventListener("focusout",
            libraryAreaInstanceNameFocusOutEventUseCase
        );

        nameElement.addEventListener("keypress",
            libraryAreaInstanceNameKeyPressEventService
        );

        if (instance.type !== "folder") {
            const symbolElement = spans[1] as NonNullable<HTMLElement>;
            symbolElement.addEventListener(EventType.MOUSE_DOWN, () => {});
        }
    }
};