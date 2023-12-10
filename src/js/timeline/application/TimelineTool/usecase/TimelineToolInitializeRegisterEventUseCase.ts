import { execute as timelineToolLayerAddInitializeRegisterEventUseCase } from "../application/LayerAdd/usecase/TimelineToolLayerAddInitializeRegisterEventUseCase";

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
};