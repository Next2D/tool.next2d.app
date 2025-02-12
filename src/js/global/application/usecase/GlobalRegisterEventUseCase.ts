import { execute as globalWindowResizeEventUseCase } from "./GlobalWindowResizeEventUseCase";
import { execute as globalTouchEndService } from "../service/GlobalTouchEndService";

/**
 * @description グローバルイベントの登録関数
 *             Function to register global events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // タブレットでのダブルタップでのズーム処理を制御
    document.addEventListener("touchend",
        globalTouchEndService,
        { "passive": false }
    );

    // リサイズイベントを登録
    window.addEventListener("resize", globalWindowResizeEventUseCase);
};