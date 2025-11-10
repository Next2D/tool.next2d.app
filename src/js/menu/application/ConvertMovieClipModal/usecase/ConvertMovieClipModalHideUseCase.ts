import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import { execute as convertMovieClipModalChildInactiveService } from "../service/ConvertMovieClipModalChildInactiveService";

/**
 * @description MovieClipの変換エリアを非表示にする
 *              Hide the MovieClip's conversion area
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

    // 全ての子要素のactiveクラスを削除する
    convertMovieClipModalChildInactiveService();

    const menu = $getMenu($CONVERT_MOVIE_CLIP_MODAL_NAME);
    if (!menu) {
        return;
    }

    menu.hide();
};