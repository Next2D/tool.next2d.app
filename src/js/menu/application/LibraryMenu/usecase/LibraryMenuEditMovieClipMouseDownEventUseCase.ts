import { $allHideMenu } from "../../MenuUtil";
import { execute as libraryMenuRunSelectedMovieClipUseCase } from "./LibraryMenuRunSelectedMovieClipUseCase";

/**
 * @description ライブラリメニューのMovieClip編集ボタンの実行関数
 *              Execution function for the Edit MovieClip button in the Library menu
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return ;
    }

    // メニューを非表示に更新
    $allHideMenu();

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 選択されたMovieClipを起動
    await libraryMenuRunSelectedMovieClipUseCase();
};