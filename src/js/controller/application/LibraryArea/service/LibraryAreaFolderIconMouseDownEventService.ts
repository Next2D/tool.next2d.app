import type { Folder } from "@/core/domain/model/Folder";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description 選択中のライブラリID
 *              Library ID currently selected
 *
 * @type {number}
 * @private
 */
let selectedLibraryId: number = -1;

/**
 * @description フォルダアイコンのダブルタップ処理関数
 *              Double-tap processing function for folder icons
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

    // ダブルタップ処理
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ライブラリIDをセット
        selectedLibraryId = parseInt(element.dataset.libraryId as string);

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            selectedLibraryId = -1;
            wait = false;
        }, 300);

    } else {

        // ダブルタップを終了
        wait = false;

        // 親のイベントでアイテム選択処理を行うので、ここではstop関数を実行しない
        // @see LibraryAreaSelectedMouseDownUseCase
        const libraryId = parseInt(element.dataset.libraryId as string);
        if (selectedLibraryId !== libraryId) {
            return ;
        }

        // 選択中のIDをリセット
        selectedLibraryId = -1;

        // 親のイベントを終了
        event.stopPropagation();
        event.preventDefault();

        const workSpace = $getCurrentWorkSpace();
        const folder: InstanceImpl<Folder> = workSpace.getLibrary(libraryId);

        const externalFolder = new ExternalFolder(workSpace, folder);
        if (folder.mode === "close") {
            externalFolder.open();
        } else {
            externalFolder.close();
        }
    }
};