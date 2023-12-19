import { execute as timelineToolLayerAddUseCase } from "@/timeline/application/TimelineTool/application/LayerAdd/usecase/TimelineToolLayerAddUseCase";
import {
    $generateShortcutKey,
    $setShortcut
} from "@/shortcut/ShortcutUtil";

/**
 * @description タイムラインエリアのショートカットイベントを登録
 *              Register shortcut events in the timeline area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 新規レイヤー追加
    $setShortcut(
        $generateShortcutKey("+", { "ctrl": true }),
        timelineToolLayerAddUseCase
    );
    $setShortcut(
        $generateShortcutKey(";", { "ctrl": true }),
        timelineToolLayerAddUseCase
    );

};