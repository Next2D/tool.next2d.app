import { $selectReference } from "../ConvertMovieClipModalUtil";
import { execute as convertMovieClipModalChildInactiveService } from "../service/ConvertMovieClipModalChildInactiveService";
import { execute as convertMovieClipModalUpdateButtonService } from "../service/ConvertMovieClipModalUpdateButtonService";

/**
 * @description ConvertMovieClipModalの子要素がPointerDownイベントを受け取った際の処理
 *              Process when a child element of ConvertMovieClipModal receives a PointerDown event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを抑制する
    event.stopPropagation();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return;
    }

    // 全ての子要素のactiveクラスを削除する
    convertMovieClipModalChildInactiveService();

    // 選択された要素にactiveクラスを追加する
    element.classList.add("active");

    // 参照選択状態をセットする
    $selectReference();

    // 変換ボタンの状態を更新
    convertMovieClipModalUpdateButtonService();
};