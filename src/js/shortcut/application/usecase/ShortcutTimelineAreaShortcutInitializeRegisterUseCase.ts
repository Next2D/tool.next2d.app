import { execute as timelineToolLayerAddUseCase } from "@/timeline/application/TimelineTool/application/LayerAdd/usecase/TimelineToolLayerAddUseCase";
import { execute as timelineLayerArrowDownUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerArrowDownUseCase";
import { execute as timelineLayerArrowUpUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerArrowUpUseCase";
import { execute as timelineToolLayerDeleteUseCase } from "@/timeline/application/TimelineTool/application/LayerDelete/usecase/TimelineToolLayerDeleteUseCase";
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

    // レイヤー移動
    $setShortcut(
        $generateShortcutKey("ArrowUp", { "ctrl": true }),
        timelineLayerArrowUpUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowDown", { "ctrl": true }),
        timelineLayerArrowDownUseCase
    );

    // レイヤー削除
    $setShortcut(
        $generateShortcutKey("Backspace", { "ctrl": true }),
        timelineToolLayerDeleteUseCase
    );
};