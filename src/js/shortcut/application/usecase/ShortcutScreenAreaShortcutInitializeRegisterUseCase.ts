import { $generateShortcutKey, $setShortcut } from "@/shortcut/ShortcutUtil";
import { execute as screenDisplayObjectArrowLeftEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectArrowLeftEventUseCase";
import { execute as screenDisplayObjectArrowRightEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectArrowRightEventUseCase";
import { execute as screenDisplayObjectArrowUpEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectArrowUpEventUseCase";
import { execute as screenDisplayObjectArrowDownEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectArrowDownEventUseCase";
import { execute as alignSettingLeftPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingLeftPointerDownEventService";
import { execute as alignSettingCenterPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingCenterPointerDownEventService";
import { execute as alignSettingRightPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingRightPointerDownEventService";
import { execute as alignSettingTopPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingTopPointerDownEventService";
import { execute as alignSettingMiddlePointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingMiddlePointerDownEventService";
import { execute as alignSettingBottomPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingBottomPointerDownEventService";
import { execute as alignSettingStageLeftPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageLeftPointerDownEventService";
import { execute as alignSettingStageCenterPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageCenterPointerDownEventService";
import { execute as alignSettingStageRightPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageRightPointerDownEventService";
import { execute as alignSettingStageTopPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageTopPointerDownEventService";
import { execute as alignSettingStageMiddlePointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageMiddlePointerDownEventService";
import { execute as alignSettingStageBottomPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageBottomPointerDownEventService";
import { execute as screenAreaDeleteKeyEventUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaDeleteKeyEventUseCase";

/**
 * @description スクリーンエリアのショートカットイベントを登録
 *              Register shortcut events in the screen area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 左方向に移動
    $setShortcut(
        $generateShortcutKey("ArrowLeft"),
        screenDisplayObjectArrowLeftEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowLeft", { "shift": true }),
        screenDisplayObjectArrowLeftEventUseCase
    );

    // 右方向に移動
    $setShortcut(
        $generateShortcutKey("ArrowRight"),
        screenDisplayObjectArrowRightEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowRight", { "shift": true }),
        screenDisplayObjectArrowRightEventUseCase
    );

    // 上方向に移動
    $setShortcut(
        $generateShortcutKey("ArrowUp"),
        screenDisplayObjectArrowUpEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowUp", { "shift": true }),
        screenDisplayObjectArrowUpEventUseCase
    );

    // 下方向に移動
    $setShortcut(
        $generateShortcutKey("ArrowDown"),
        screenDisplayObjectArrowDownEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowDown", { "shift": true }),
        screenDisplayObjectArrowDownEventUseCase
    );

    // 選択範囲の整列
    $setShortcut(
        $generateShortcutKey("1"),
        alignSettingLeftPointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("2"),
        alignSettingCenterPointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("3"),
        alignSettingRightPointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("4"),
        alignSettingTopPointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("5"),
        alignSettingMiddlePointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("6"),
        alignSettingBottomPointerDownEventService
    );

    // ステージ範囲の整列
    $setShortcut(
        $generateShortcutKey("1", { "ctrl": true }),
        alignSettingStageLeftPointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("2", { "ctrl": true }),
        alignSettingStageCenterPointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("3", { "ctrl": true }),
        alignSettingStageRightPointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("4", { "ctrl": true }),
        alignSettingStageTopPointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("5", { "ctrl": true }),
        alignSettingStageMiddlePointerDownEventService
    );
    $setShortcut(
        $generateShortcutKey("6", { "ctrl": true }),
        alignSettingStageBottomPointerDownEventService
    );

    // DisplayObject削除
    $setShortcut(
        $generateShortcutKey("Delete"),
        screenAreaDeleteKeyEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("Backspace"),
        screenAreaDeleteKeyEventUseCase
    );
};