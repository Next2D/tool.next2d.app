import { $TIMELINE_PLAY_STOP_ID } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $getRightFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as timelineLabelNameUpdateService } from "@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";

/**
 * @type {number}
 * @default 0
 * @private
 */
let timerId: number = 0;

/**
 * @description 再生・停止ボタンのマウスダウン処理関数
 *              Mouse down processing function for play/stop button
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_PLAY_STOP_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // タイムラインにキーフレームが存在しない場合は処理を行わない
    const maxFrame = movieClip.maxFrame;
    if (!maxFrame || 2 >= maxFrame) {
        return ;
    }

    // フラグを反転させる
    timelineHeader.stopFlag = !timelineHeader.stopFlag;

    // 表示を更新
    element.setAttribute("class", timelineHeader.stopFlag
        ? "play"
        : "stop"
    );

    if (timelineHeader.stopFlag) {
        // 停止処理
        clearInterval(timerId);

        // 停止したフレームのラベルを表示
        timelineLabelNameUpdateService(
            movieClip.getLabel(movieClip.currentFrame)
        );

        // サウンドエリアの設定エリアを再構築
        soundAreaRebuildSettingAreaUseCase();
    } else {

        // ラベルの表示を初期化
        timelineLabelNameUpdateService("");

        // サウンドエリアの設定エリアを再構築
        soundAreaRebuildSettingAreaUseCase();

        // 外部APIを起動
        const externalTimeline = new ExternalTimeline(workSpace, movieClip);

        if (movieClip.currentFrame >= maxFrame - 1) {
            timelineScrollUpdateScrollXUseCase(-movieClip.scrollX);
            await externalTimeline.changeFrame(1);
        }

        let time = performance.now();
        const fps = 1000 / workSpace.stage.fps | 0;

        const loop = async (timestamp: number = 0): Promise<void> =>
        {
            // 停止フラグが立っていたら処理を終了
            if (timelineHeader.stopFlag) {

                // タイマーの停止処理
                clearInterval(timerId);

                // 再生表示に切り替え
                element.setAttribute("class", "play");

                // 停止したフレームのラベルを表示
                timelineLabelNameUpdateService(
                    movieClip.getLabel(movieClip.currentFrame)
                );

                // サウンドエリアの設定エリアを再構築
                soundAreaRebuildSettingAreaUseCase();
                return ;
            }

            const delta: number = timestamp - time;
            if (delta > fps) {
                // 次のフレームのタイムスタンプを計算
                time = timestamp - delta % fps;

                // フレームを1つ進める
                const frame = movieClip.currentFrame + 1;

                // 最終フレームに到達したら停止、ループなら1フレーム目に戻す
                if (frame >= maxFrame) {
                    if (timelineHeader.loopFlag) {
                        // スクロール値を1フレーム目に戻す
                        timelineScrollUpdateScrollXUseCase(-movieClip.scrollX);

                        // 1フレーム目に移動
                        await externalTimeline.changeFrame(1);

                        // タイマーをセットして終了
                        timerId = requestAnimationFrame(loop);
                    } else {
                        // タイマーの停止処理
                        clearInterval(timerId);

                        // 停止フラグを立てる
                        timelineHeader.stopFlag = true;

                        // 再生表示に切り替え
                        element.setAttribute("class", "play");

                        // 停止したフレームのラベルを表示
                        timelineLabelNameUpdateService(
                            movieClip.getLabel(movieClip.currentFrame)
                        );

                        // サウンドエリアの設定エリアを再構築
                        soundAreaRebuildSettingAreaUseCase();
                    }
                } else {
                    // マーカーが画面の右端に到達したらレイヤレイヤーを移動
                    if (frame >= $getRightFrame()) {
                        timelineScrollUpdateScrollXUseCase(timelineHeader.clientWidth);
                    }

                    // フレームを進めて描画
                    await externalTimeline.changeFrame(frame);
                    timerId = requestAnimationFrame(loop);
                }

            } else {
                timerId = requestAnimationFrame(loop);
            }
        };

        timerId = requestAnimationFrame(loop);
    }
};