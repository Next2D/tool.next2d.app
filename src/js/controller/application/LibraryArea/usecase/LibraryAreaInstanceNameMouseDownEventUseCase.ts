import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as libraryAreaActiceInstanceTextContentService } from "../service/LibraryAreaActiceInstanceTextContentService";

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
 * @description インスタンスの名前エリアのダブルタップ処理関数
 *              Double-tap processing function for instance name area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    switch (true) {

        case event.button !== 0:
        case $useKeyboard():
        case event.altKey:
        case event.metaKey:
        case event.shiftKey:
            return ;

        default:
            break;

    }

    // ダブルタップ処理
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const libraryId = parseInt(element.dataset.libraryId as string);
    if (!wait || selectedLibraryId !== libraryId) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ライブラリIDをセット
        selectedLibraryId = libraryId;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
            selectedLibraryId = -1;
        }, 300);

    } else {

        // 変数を初期化
        wait = false;
        selectedLibraryId = -1;

        // 親のイベントでアイテム選択処理を行うので、ここではstop関数を実行しない
        // @see LibraryAreaSelectedMouseDownUseCase

        // 親のイベントを終了
        event.stopPropagation();
        event.preventDefault();

        // インスタンス名を編集モードへ
        libraryAreaActiceInstanceTextContentService(element);
    }
};