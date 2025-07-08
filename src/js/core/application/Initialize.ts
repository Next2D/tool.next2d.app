import { EventType } from "@/tool/domain/event/EventType";
import { $bootAudioContext } from "./CoreUtil";

/**
 * @description コア機能の初期起動関数
 *              Initial startup functions for core functions
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // AudioContextの起動用クリックイベントを登録
    window.addEventListener(EventType.POINTER_UP, $bootAudioContext);
};