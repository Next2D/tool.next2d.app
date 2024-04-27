import { execute as timelineToolLayerAddInitializeRegisterEventUseCase } from "../application/LayerAdd/usecase/TimelineToolLayerAddInitializeRegisterEventUseCase";
import { execute as timelineToolCurrentFrameInitializeRegisterEventUseCase } from "../application/CurrentFrame/usecase/TimelineToolCurrentFrameInitializeRegisterEventUseCase";
import { execute as timelineToolLayerDeleteInitializeRegisterEventUseCase } from "../application/LayerDelete/usecase/TimelineToolLayerDeleteInitializeRegisterEventUseCase";
import { execute as timelineToolLightAllInitializeRegisterEventUseCase } from "../application/LightAll/usecase/TimelineToolLightAllInitializeRegisterEventUseCase";
import { execute as timelineToolDisableAllInitializeRegisterEventUseCase } from "../application/DisableAll/usecase/TimelineToolDisableAllInitializeRegisterEventUseCase";
import { execute as timelineToolLockAllInitializeRegisterEventUseCase } from "../application/LockAll/usecase/TimelineToolLockAllInitializeRegisterEventUseCase";
import { execute as timelineToolScriptEditorInitializeRegisterEventUseCase } from "../application/ScriptEditor/usecase/TimelineToolScriptEditorInitializeRegisterEventUseCase";
import { execute as timelineToolAddKeyFrameInitializeRegisterEventUseCase } from "../application/AddKeyFrame/usecase/TimelineToolAddKeyFrameInitializeRegisterEventUseCase";
import { execute as timelineToolAddEmptyKeyFrameInitializeRegisterEventUseCase } from "../application/AddEmptyKeyFrame/usecase/TimelineToolAddEmptyKeyFrameInitializeRegisterEventUseCase";
import { execute as timelineToolInsertFramesInitializeRegisterEventUseCase } from "../application/InsertFrames/usecase/TimelineToolInsertFramesInitializeRegisterEventUseCase";
import { execute as timelineToolEraseFramesInitializeRegisterEventUseCase } from "../application/EraseFrames/usecase/TimelineToolEraseFramesInitializeRegisterEventUseCase";
import { execute as timelineToolDeleteKeyframeInitializeRegisterEventUseCase } from "../application/DeleteKeyframe/usecase/TimelineToolDeleteKeyframeInitializeRegisterEventUseCase";
import { execute as timelineToolLabelInputInitializeRegisterEventUseCase } from "../application/LabelInput/usecase/TimelineToolLabelInputInitializeRegisterEventUseCase";
import { execute as timelineToolRepeatInitializeRegisterEventUseCase } from "../application/Repeat/usecase/TimelineToolRepeatInitializeRegisterEventUseCase";
import { execute as timelineToolPlayStopInitializeRegisterEventUseCase } from "../application/PlayStop/usecase/TimelineToolPlayStopInitializeRegisterEventUseCase";

/**
 * @description タイムラインの各種ツールにイベント登録を行う
 *              Register events in the various tools of the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // レイヤー追加のイベント登録
    timelineToolLayerAddInitializeRegisterEventUseCase();

    // フレームInput Elementのイベント登録
    timelineToolCurrentFrameInitializeRegisterEventUseCase();

    // レイヤー削除のイベント登録
    timelineToolLayerDeleteInitializeRegisterEventUseCase();

    // 全体ハイライトボタンのイベント登録
    timelineToolLightAllInitializeRegisterEventUseCase();

    // 全体表示ボタンのイベント登録
    timelineToolDisableAllInitializeRegisterEventUseCase();

    // 全体ロックボタンのイベント登録
    timelineToolLockAllInitializeRegisterEventUseCase();

    // スクリプトエディタ表示のイベント登録
    timelineToolScriptEditorInitializeRegisterEventUseCase();

    // キーフレーム追加のイベント登録
    timelineToolAddKeyFrameInitializeRegisterEventUseCase();

    // 空のキーフレーム追加のイベント登録
    timelineToolAddEmptyKeyFrameInitializeRegisterEventUseCase();

    // フレーム追加のイベント登録
    timelineToolInsertFramesInitializeRegisterEventUseCase();

    // フレームの削除のイベント登録
    timelineToolEraseFramesInitializeRegisterEventUseCase();

    // キーフレームの削除のイベント登録
    timelineToolDeleteKeyframeInitializeRegisterEventUseCase();

    // ラベル名操作のイベント登録
    timelineToolLabelInputInitializeRegisterEventUseCase();

    // ループ設定のイベント登録
    timelineToolRepeatInitializeRegisterEventUseCase();

    // 再生・停止ボタンのイベント登録
    timelineToolPlayStopInitializeRegisterEventUseCase();
};