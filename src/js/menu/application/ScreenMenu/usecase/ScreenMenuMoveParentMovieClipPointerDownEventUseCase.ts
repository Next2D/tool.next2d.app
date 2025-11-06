import { $allHideMenu } from "../../MenuUtil";
import { execute as screenAreaRunParentMovieClipUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRunParentMovieClipUseCase";

/**
 * @description 親ムービークリップ移動メニューのポインタダウンイベント実行処理
 *              Parent movie clip move menu pointer down event execution process
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // メニューを全て閉じる
    $allHideMenu();

    // 親ムービークリップ移動処理を実行
    await screenAreaRunParentMovieClipUseCase();
};