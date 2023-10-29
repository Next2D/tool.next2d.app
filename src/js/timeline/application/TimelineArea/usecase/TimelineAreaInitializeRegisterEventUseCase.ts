import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as timelineAreaMouseDownEventUseCase } from "./TimelineAreaMouseDownEventUseCase";

/**
 * @description タイムラインエリアの初期イベント登録
 *              Initial event registration in the timeline area
 *
 * @params  {HTMLElement} element
 * @returns {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // タップ、ダブルタップの処理
    element.addEventListener(EventType.MOUSE_DOWN, timelineAreaMouseDownEventUseCase);
};