import { $getActiveTool } from "@/tool/application/ToolUtil";
import { execute as screenAreaRunParentMovieClipUseCase } from "./ScreenAreaRunParentMovieClipUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description スクリーンエリアのマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the screen area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        const tool = $getActiveTool();
        if (!tool) {
            return ;
        }

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

        // スクリーンイベントを実行
        tool.dispatchEvent(EventType.SCREEN, event);

        // 範囲選択のイベントを実行
        tool.dispatchEvent(EventType.STAGE_RECT, event);

        // 矩形描画のイベントを実行
        tool.dispatchEvent(EventType.DRAW_RECT, event);

    } else {

        // ダブルタップを終了
        wait = false;

        // 親のMovieClipに移動
        await screenAreaRunParentMovieClipUseCase();
    }
};