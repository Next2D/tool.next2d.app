import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineSceneListAddMovieClipUseCase } from "@/timeline/application/TimelineSceneList/usecase/TimelineSceneListAddMovieClipUseCase";
import { execute as externalTimelineEditMovieClipUseCase } from "@/external/timeline/application/ExternalTimeline/service/ExternalTimelineEditMovieClipUseCase";

/**
 * @description スクリーンの選択中のMovieClipのPointerDownEvent処理関数
 *              PointerDownEvent processing function of the selected MovieClip on the screen
 *
 * @param  {PointerEvent | KeyboardEvent} eventt
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent | KeyboardEvent): Promise<void> =>
{
    // メニューを全て閉じる
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.isSingleSelectedOfDisplayObject()) {
        return ;
    }

    const layer = movieClip.getLayer(
        movieClip.selectedDepths.keys().next().value as number
    );
    if (!layer) {
        return ;
    }

    const values = movieClip.selectedDepths.values().next().value as number[];
    const character = layer.getCharacter(movieClip.currentFrame, values[0]);
    if (!character) {
        return ;
    }

    const instance = workSpace.getLibrary(character.libraryId);
    if (!instance) {
        return ;
    }

    if (instance.type !== $MOVIE_CLIP_TYPE) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // タイムラインのシーン一覧に追加
    timelineSceneListAddMovieClipUseCase(movieClip.id, character);

    // 指定のMovieClipを起動
    await externalTimelineEditMovieClipUseCase(workSpace, instance as MovieClip);
};