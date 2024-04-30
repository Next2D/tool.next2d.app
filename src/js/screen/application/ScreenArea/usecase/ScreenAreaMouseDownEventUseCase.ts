import { $getActiveTool } from "@/tool/application/ToolUtil";
import { execute as screenAreaRunParentMovieClipUseCase } from "./ScreenAreaRunParentMovieClipUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @type {NodeJS.Timeout}
 * @private
 */
let timerId: NodeJS.Timeout;

/**
 * @description スクリーンエリアのマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the screen area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示
    $allHideMenu();

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        timerId = setTimeout((): void =>
        {
            wait = false;
            const tool = $getActiveTool();
            if (!tool) {
                return ;
            }

            // スクリーンイベントを実行
            tool.dispatchEvent(EventType.SCREEN, event);
        }, 300);

    } else {

        // ダブルタップを終了
        wait = false;

        clearTimeout(timerId);

        // 親のMovieClipに移動
        screenAreaRunParentMovieClipUseCase();
    }
};