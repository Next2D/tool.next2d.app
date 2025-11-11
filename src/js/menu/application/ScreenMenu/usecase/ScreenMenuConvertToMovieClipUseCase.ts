import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu, $getMenu } from "../../MenuUtil";
import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";

/**
 * @description 指定のDisplayObjectをMovieClipに変換する
 *              Convert the specified DisplayObject to MovieClip
 *
 * @param  {PointerEvent | KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent | KeyboardEvent): void =>
{
    // メニューを非表示にする
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // レイヤー選択は1つのみ許可
    if (movieClip.selectedDepths.size !== 1) {
        return;
    }

    // 親のイベントを停止
    event.preventDefault();

    const menu = $getMenu($CONVERT_MOVIE_CLIP_MODAL_NAME);
    if (!menu) {
        return;
    }

    menu.show();
};