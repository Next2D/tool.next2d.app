import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import { $CONVERT_MOVIE_CLIP_INPUT_ID } from "@/config/ConvertMovieClipConfig";
import { $resetState } from "../ConvertMovieClipModalUtil";
import { execute as convertMovieClipModalChildInactiveService } from "../service/ConvertMovieClipModalChildInactiveService";
import { execute as convertMovieClipModalUpdateButtonService } from "../service/ConvertMovieClipModalUpdateButtonService";

/**
 * @description MovieClipの変換エリアを非表示にする
 *              Hide the MovieClip's conversion area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu = $getMenu($CONVERT_MOVIE_CLIP_MODAL_NAME);
    if (!menu) {
        return;
    }

    const inputElement = document.getElementById($CONVERT_MOVIE_CLIP_INPUT_ID) as HTMLInputElement;
    if (!inputElement) {
        return;
    }

    // 全ての子要素のactiveクラスを削除する
    convertMovieClipModalChildInactiveService();

    // 入力フィールドの値を初期化する
    inputElement.value = "";

    // 状態を初期化する
    $resetState();

    // 変換ボタンの状態を更新
    convertMovieClipModalUpdateButtonService();

    // モーダルを非表示にする
    menu.hide();
};