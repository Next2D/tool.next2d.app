import { execute as timelineToolLayerAddInitializeRegisterEventUseCase } from "../application/LayerAdd/usecase/TimelineToolLayerAddInitializeRegisterEventUseCase";
import { execute as timelineToolCurrentFrameInitializeRegisterEventUseCase } from "../application/CurrentFrame/usecase/TimelineToolCurrentFrameInitializeRegisterEventUseCase";
import { execute as timelineToolLayerDeleteInitializeRegisterEventUseCase } from "../application/LayerDelete/usecase/TimelineToolLayerDeleteInitializeRegisterEventUseCase";
import { execute as timelineToolLightAllInitializeRegisterEventUseCase } from "../application/LightAll/usecase/TimelineToolLightAllInitializeRegisterEventUseCase";
import { execute as timelineToolDisableAllInitializeRegisterEventUseCase } from "../application/DisableAll/usecase/TimelineToolDisableAllInitializeRegisterEventUseCase";
import { execute as timelineToolLockAllInitializeRegisterEventUseCase } from "../application/LockAll/usecase/TimelineToolLockAllInitializeRegisterEventUseCase";
import { execute as timelineToolScriptEditorInitializeRegisterEventUseCase } from "../application/ScriptEditor/usecase/TimelineToolScriptEditorInitializeRegisterEventUseCase";
import { execute as timelineToolAddKeyFrameInitializeRegisterEventUseCase } from "../application/AddKeyFrame/usecase/TimelineToolAddKeyFrameInitializeRegisterEventUseCase";

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
};