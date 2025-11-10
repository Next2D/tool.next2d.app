import { $CONVERT_MOVIE_CLIP_INPUT_ID } from "@/config/ConvertMovieClipConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as convertMovieClipModalHideUseCase } from "./ConvertMovieClipModalHideUseCase";

/**
 * @description 指定の名前のMovieClipを作成して、選択中のDisplayObjectを配置
 *              Create a MovieClip with the specified name and place the selected DisplayObject
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    const workspace = $getCurrentWorkSpace();
    const movieClip = workspace.scene;

    // 選択中のDisplayObjectがない場合は処理を終了する
    if (!movieClip.selectedDepths.size) {
        return;
    }

    const inputElement = document
        .getElementById($CONVERT_MOVIE_CLIP_INPUT_ID) as HTMLInputElement;
    if (!inputElement || !inputElement.value) {
        return;
    }

    // イベントの伝播を停止する
    event.stopPropagation();

    // 指定の名前でMovieClipを作成
    const name = inputElement.value;
    console.log(name);

    // todo

    // モーダルを非表示にする
    convertMovieClipModalHideUseCase();
};