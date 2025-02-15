import { execute as userDatabaseSaveShowModalUseCase } from "@/user/application/Database/usecase/UserDatabaseSaveShowModalUseCase";
import { execute as userSettingMenuShowService } from "@/menu/application/UserSettingMenu/service/UserSettingMenuShowService";
import { execute as arrowToolActiveService } from "@/tool/application/ArrowTool/service/ArrowToolActiveService";
import { execute as zoomPlusToolActiveService } from "@/tool/application/ZoomPlusTool/service/ZoomPlusToolActiveService";
import { execute as zoomMinusToolActiveService } from "@/tool/application/ZoomMinusTool/service/ZoomMinusToolActiveService";
import { execute as circleToolActiveService } from "@/tool/application/CircleTool/service/CircleToolActiveService";
import { execute as rectangleToolActiveService } from "@/tool/application/RectangleTool/service/RectangleToolActiveService";
import { execute as roundRectToolActiveService } from "@/tool/application/RoundRectTool/service/RoundRectToolActiveService";
import { execute as textToolActiveService } from "@/tool/application/TextTool/service/TextToolActiveService";
import { execute as shortcutUndoUseCase } from "./ShortcutUndoUseCase";
import { execute as shortcutRedoUseCase } from "./ShortcutRedoUseCase";
import {
    $generateShortcutKey,
    $setShortcut
} from "@/shortcut/ShortcutUtil";

/**
 * @description 画面全体で利用可能なコマンドを登録
 *              Register commands available throughout the screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // データ保存
    $setShortcut(
        $generateShortcutKey("s", { "ctrl": true }),
        userDatabaseSaveShowModalUseCase
    );

    // Undo
    $setShortcut(
        $generateShortcutKey("z", { "ctrl": true }),
        shortcutUndoUseCase
    );

    // Redo
    $setShortcut(
        $generateShortcutKey("z", { "ctrl": true, "shift": true }),
        shortcutRedoUseCase
    );

    // ユーザー設定
    $setShortcut(
        $generateShortcutKey("u"),
        userSettingMenuShowService
    );

    // 矢印ツールをアクティブにする
    $setShortcut(
        $generateShortcutKey("v"),
        arrowToolActiveService
    );

    // ズームツールをアクティブにする
    $setShortcut(
        $generateShortcutKey("z"),
        zoomPlusToolActiveService
    );

    // ズームアウトツールをアクティブにする
    $setShortcut(
        $generateShortcutKey("z", { "shift": true }),
        zoomMinusToolActiveService
    );

    // 円ツールをアクティブにする
    $setShortcut(
        $generateShortcutKey("o"),
        circleToolActiveService
    );

    // 矩形ツールをアクティブにする
    $setShortcut(
        $generateShortcutKey("r"),
        rectangleToolActiveService
    );

    // 角丸矩形ルーツをアクティブにする
    $setShortcut(
        $generateShortcutKey("r", { "shift": true }),
        roundRectToolActiveService
    );

    // テキストルーツをアクティブにする
    $setShortcut(
        $generateShortcutKey("t"),
        textToolActiveService
    );
};