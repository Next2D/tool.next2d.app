import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $allHideMenu } from "../../MenuUtil";
import { execute as libraryMenuRunSelectedMovieClipUseCase } from "./LibraryMenuRunSelectedMovieClipUseCase";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description ライブラリメニューのMovieClip編集ボタンの実行関数
 *              Execution function for the Edit MovieClip button in the Library menu
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
        || !timelineHeader.stopFlag
    ) {
        return ;
    }

    // メニューを非表示に更新
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 選択されたMovieClipを起動
    await libraryMenuRunSelectedMovieClipUseCase();
};