import { execute as timelineToolLayerAddInitializeRegisterEventUseCase } from "../application/LayerAdd/usecase/TimelineToolLayerAddInitializeRegisterEventUseCase";
import { execute as timelineToolCurrentFrameInitializeRegisterEventUseCase } from "../application/CurrentFrame/usecase/TimelineToolCurrentFrameInitializeRegisterEventUseCase";
import { execute as timelineToolLayerDeleteInitializeRegisterEventUseCase } from "../application/LayerDelete/usecase/TimelineToolLayerDeleteInitializeRegisterEventUseCase";
import { execute as timelineToolLightAllInitializeRegisterEventUseCase } from "../application/LightAll/usecase/TimelineToolLightAllInitializeRegisterEventUseCase";

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
};