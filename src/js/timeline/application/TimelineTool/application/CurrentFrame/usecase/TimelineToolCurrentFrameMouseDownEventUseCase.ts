import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as timelineToolCurrentFrameWindowRegisterEventUseCase } from "./TimelineToolCurrentFrameWindowRegisterEventUseCase";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description タイムラインの現在フレームのInput Elementのマウスダウン処理関数
 *              Mouse-down processing function for the Input Element at the current frame of the timeline
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 主ボタン以外はスキップ
    if (event.button !== 0 || $useKeyboard()) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示にする
    $allHideMenu();

    if ($useKeyboard()) {
        return ;
    }

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

        // windowイベントを登録
        timelineToolCurrentFrameWindowRegisterEventUseCase();

    } else {

        // ダブルタップを終了
        wait = false;
    }
};