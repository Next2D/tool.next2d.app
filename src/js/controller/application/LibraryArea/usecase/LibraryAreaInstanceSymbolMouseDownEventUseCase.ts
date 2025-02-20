import { execute as libraryAreaActiceInstanceTextContentService } from "../service/LibraryAreaActiceInstanceTextContentService";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import {
    $getEditingElement,
    $setEditingElement
} from "@/global/GlobalUtil";
import {
    $setNameSelectedLibraryId,
    $setSymbolSelectedLibraryId,
    $getSymbolSelectedLibraryId
} from "../LibraryAreaUtil";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description インスタンスのシンボルエリアのダブルタップ処理関数
 *              Double-tap processing function for the symbol area of an instance
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

    const selectedLibraryId = $getSymbolSelectedLibraryId();

    const libraryId = parseInt(element.dataset.libraryId as string);
    if ($useKeyboard()) {
        const editingElement = $getEditingElement();
        if (editingElement && selectedLibraryId !== libraryId) {
            editingElement.blur();
            $setEditingElement(null);
            $setNameSelectedLibraryId(-1);
            $setSymbolSelectedLibraryId(-1);
        } else {
            event.stopPropagation();
            return ;
        }
    }

    if (!wait || selectedLibraryId !== libraryId) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ライブラリIDをセット
        $setSymbolSelectedLibraryId(libraryId);

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

    } else {

        // 変数を初期化
        wait = false;

        if (selectedLibraryId !== libraryId) {
            return ;
        }

        // 親のイベントを終了
        event.stopPropagation();
        event.preventDefault();

        // インスタンス名を編集モードへ
        libraryAreaActiceInstanceTextContentService(element);
    }
};