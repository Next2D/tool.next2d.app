import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import { execute as convertMovieClipModalChildInactiveService } from "../service/ConvertMovieClipModalChildInactiveService";

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

    // 全ての子要素のactiveクラスを削除する
    convertMovieClipModalChildInactiveService();

    menu.hide();
};