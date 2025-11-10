import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalLibraryGetItemUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryGetItemUseCase";
import { execute as detailModalCustomFadeInUseCase } from "@/menu/application/DetailModal/usecase/DetailModalCustomFadeInUseCase";
import { $ERROR_DUPLICATE_NAME_TEXT } from "@/config/ErrorTextConfig";
import { $verifyValue } from "../ConvertMovieClipModalUtil";
import { execute as convertMovieClipModalUpdateButtonService } from "../service/ConvertMovieClipModalUpdateButtonService";

/**
 * @description ConvertMovieClipModalの入力フィールドからフォーカスが外れたときの処理
 *              Process when focus is lost from the input field of ConvertMovieClipModal
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement) {
        return;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 重複チェック
    const item = externalLibraryGetItemUseCase(
        $getCurrentWorkSpace(),
        inputElement.value
    );

    if (item) {

        const parent = inputElement.offsetParent as HTMLElement;
        if (!parent) {
            return;
        }

        // 進行状況画面を表示
        detailModalCustomFadeInUseCase(
            $ERROR_DUPLICATE_NAME_TEXT,
            parent.offsetLeft - 35, parent.offsetTop - 55
        );

        // 入力のやり直しを促す
        $verifyValue(false);

        inputElement.focus();
    } else {
        // 入力が有効であることをセット
        $verifyValue(true);

        // 入力モードを終了する
        $updateKeyLock(false);
    }

    // 変換ボタンの状態を更新
    convertMovieClipModalUpdateButtonService();
};