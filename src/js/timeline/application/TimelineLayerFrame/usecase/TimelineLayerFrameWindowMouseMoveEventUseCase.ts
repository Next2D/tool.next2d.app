import { $TIMELINE_LAYER_CONTROLLER_WIDTH, $TIMELINE_TOOL_HEIGHT_SIZE } from "@/config/TimelineConfig";
import { $TOOL_AERA_WIDTH } from "@/config/ToolConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { execute as timelineScrollUpdateScrollYUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollYUseCase";
import { execute as timelineLayerFrameSelectedService } from "../service/TimelineLayerFrameSelectedService";
import {
    $getMoveMode,
    $getTopIndex,
    $setMoveMode
} from "../../TimelineUtil";
import { $getTimelineOffsetTop } from "@/timeline/application/TimelineArea/TimelineAreaUtil";

/**
 * @description フレームの複数選択の実行関数
 *              Execution function for multiple frame selections
 *
 * @param  {PointerEvent} event
 * @param  {boolean} [loop_mode = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    event: PointerEvent,
    loop_mode: boolean = false
): void => {

    // 他のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;
    const timelineAreaState = workSpace.timelineAreaState;

    let offsetLeft = timelineAreaState.offsetLeft;
    if (timelineAreaState.state === "fixed") {
        offsetLeft = workSpace.toolAreaState.state === "fixed" ? $TOOL_AERA_WIDTH : 0;
    }

    const frameWidth   = timelineAreaState.frameWidth + 1;
    const baseWidth    = $TIMELINE_LAYER_CONTROLLER_WIDTH + offsetLeft;
    const minPositionX = baseWidth;
    const maxPositionX = timelineHeader.clientWidth + baseWidth;

    const minPositionY = $getTimelineOffsetTop() + $TIMELINE_TOOL_HEIGHT_SIZE;
    const maxPositionY = minPositionY + timelineAreaState.height - $TIMELINE_TOOL_HEIGHT_SIZE - 12;

    // 移動範囲が上部を超えた場合の処理
    if (event.pageY < minPositionY) {
        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // 上方向に移動
            if (!timelineScrollUpdateScrollYUseCase(-2)) {

                // 自動移動モード終了
                $setMoveMode(false);

                return ;
            }

            if (loop_mode || !$getMoveMode()) {

                // 自動移動モードを開始にセット
                if (!loop_mode) {
                    $setMoveMode(true);
                }

                execute(event, true);
            }
        });

        return ;
    }

    // 移動範囲が下部を超えた場合の処理
    if (event.pageY > maxPositionY) {
        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // 下方向に移動
            if (!timelineScrollUpdateScrollYUseCase(2)) {

                // 自動移動モード終了
                $setMoveMode(false);

                return ;
            }

            if (loop_mode || !$getMoveMode()) {

                // 自動移動モードを開始にセット
                if (!loop_mode) {
                    $setMoveMode(true);
                }

                execute(event, true);
            }
        });

        return ;
    }

    // 移動範囲が右側を超えた場合の処理
    if (event.pageX > maxPositionX) {
        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // 右方向に移動
            if (!timelineScrollUpdateScrollXUseCase(frameWidth)) {

                // 自動移動モード終了
                $setMoveMode(false);

                return ;
            }

            if (loop_mode || !$getMoveMode()) {

                // 自動移動モードを開始にセット
                if (!loop_mode) {
                    $setMoveMode(true);
                }

                const indexes = [];
                for (let idx = 0; scene.selectedLayers.length >= idx; ++idx) {
                    const externalLayer = new ExternalLayer(workSpace, scene, scene.selectedLayers[idx]);
                    indexes.push(externalLayer.index);
                }

                // 1フレーム追加
                timelineLayerFrameSelectedService(
                    workSpace, scene, indexes,
                    scene.selectedFrameObject.end + 1
                );

                execute(event, true);
            }
        });

        return ;
    }

    // 移動範囲が左側を超えた場合の処理
    if (event.pageX < minPositionX) {
        requestAnimationFrame((): void =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // 左方向に移動
            if (!timelineScrollUpdateScrollXUseCase(-frameWidth)) {

                // 自動移動モード終了
                $setMoveMode(false);

                return ;
            }

            if (loop_mode || !$getMoveMode()) {

                // 自動移動モードを開始にセット
                if (!loop_mode) {
                    $setMoveMode(true);
                }

                const indexes = [];
                for (let idx = 0; scene.selectedLayers.length >= idx; ++idx) {
                    const externalLayer = new ExternalLayer(workSpace, scene, scene.selectedLayers[idx]);
                    indexes.push(externalLayer.index);
                }

                // 1フレーム減算
                timelineLayerFrameSelectedService(
                    workSpace, scene, indexes,
                    scene.selectedFrameObject.end - 1
                );

                execute(event, true);
            }
        });

        return ;
    }

    // 自動移動モード終了
    $setMoveMode(false);

    requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        // フレームElementのキーがなければ終了
        const frame = element.dataset.frame;
        const layerIndex = element.dataset.layerIndex;
        if (!frame || !layerIndex) {
            return ;
        }

        // 最初に選択したレイヤーのindex値を取得
        const layer = scene.selectedLayers[0];
        const firstIndex = scene.layers.indexOf(layer);

        const selectedLayerIndex = parseInt(layerIndex) + $getTopIndex();

        // 選択したレイヤーと最初のレイヤーを比較
        const minIndex = Math.min(selectedLayerIndex, firstIndex);
        const maxIndex = Math.max(selectedLayerIndex, firstIndex);

        // 選択範囲のレイヤーindex値の配列を作成
        const indexes = [firstIndex];
        for (let index = minIndex; maxIndex >= index; ++index) {
            if (firstIndex === index) {
                continue;
            }
            indexes.push(index);
        }

        // 指定フレームを選択
        timelineLayerFrameSelectedService(
            workSpace, scene, indexes,
            parseInt(frame)
        );
    });
};