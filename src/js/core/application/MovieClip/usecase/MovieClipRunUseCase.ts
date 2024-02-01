import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as timelineScrollUpdateXPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateXPositionService";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineScrollUpdateYPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService";
import { execute as historyReloadUseCase } from "@/controller/application/HistoryArea/usecase/HistoryReloadUseCase";
import { execute as propertyAreaDisplayItemControllerUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaDisplayItemControllerUseCase";
import { execute as objectSettingUpdateNameService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateNameService";
import { execute as objectSettingUpdateSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateSymbolService";
import { execute as timelineToolUpdateSceneNameService } from "@/timeline/application/TimelineTool/application/SceneName/service/TimelineToolUpdateSceneNameService";

/**
 * @description MovieClipの起動処理
 *              MovieClip startup process
 *
 * @params {MovieClip} movie_clip
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    // 作業履歴を読み込む
    historyReloadUseCase();

    // タイムラインのx移動するスクロール幅を更新
    timelineScrollUpdateWidthService();

    // タイムラインのx移動するスクロールのx座標を更新
    timelineScrollUpdateXPositionService();

    // タイムラインのy移動するスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // タイムラインのy移動するスクロールのy座標を更新
    timelineScrollUpdateYPositionService();

    // タイムラインのフレーム位置を更新
    timelineFrameUpdateFrameElementService(movie_clip.currentFrame);

    // タイムラインのヘッダーを生成
    timelineHeaderBuildElementUseCase();

    // タイムラインのマーカーの座標をセット
    timelineMarkerMovePositionService();

    // タイムラインのシーン名を更新
    timelineToolUpdateSceneNameService(movie_clip.name);

    // MovieClipのLayerからタイムラインを生成
    timelineLayerBuildElementUseCase();

    // 表示名を更新
    objectSettingUpdateNameService(movie_clip.name);

    // シンボル名を更新
    objectSettingUpdateSymbolService(movie_clip.symbol);

    // プロパティーエリアの表示を更新
    propertyAreaDisplayItemControllerUseCase();
};