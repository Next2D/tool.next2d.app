import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenMenuAllInactiveService } from "../service/ScreenMenuAllInactiveService";
import { execute as screenMenuUpdateStyleSubMenuService } from "../service/ScreenMenuUpdateStyleSubMenuService";
import { execute as screenMenuUpdateStyleEditMovieClipService } from "../service/ScreenMenuUpdateStyleEditMovieClipService";
import { execute as screenMenuUpdateStyleMoveParentMovieClipService } from "../service/ScreenMenuUpdateStyleMoveParentMovieClipService";
import { execute as screenMenuUpdateStylePrevKeyframeCoordsService } from "../service/ScreenMenuUpdateStylePrevKeyframeCoordsService";

/**
 * @description スクリーンのメニューを選択中のElementに合わせてアクティブ・非アクティブに更新する
 *              Update the screen menu to be active/inactive according to the selected Element
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedDepths.size) {
        // 指定のIDを非アクティブに更新
        screenMenuAllInactiveService();
    } else {
        // サブメニューのスタイルを更新
        screenMenuUpdateStyleSubMenuService(movieClip);

        // MovieClipの編集ボタンのスタイルを更新
        screenMenuUpdateStyleEditMovieClipService(movieClip);

        // 前のキーフレームの座標に合わせるボタンのスタイルを更新
        screenMenuUpdateStylePrevKeyframeCoordsService(movieClip);
    }

    // 親のMovieClipへの移動ボタンのスタイルを更新
    screenMenuUpdateStyleMoveParentMovieClipService();
};