import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as transformSettingWidthRegisterWindowEventUseCase } from "./TransformSettingWidthRegisterWindowEventUseCase";
import { $getActiveTool, $getChangeSize } from "@/tool/application/ToolUtil";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";

/**
 * @description 変形エリアの幅変更のマウスダウンイベント
 *              Mouse down event for changing the width of the deformation area
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

    // 親のイベントを止める
    event.stopPropagation();

    if ($useKeyboard()) {
        return ;
    }

    // イベントの伝播を止める
    event.preventDefault();

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const bounds = screenAreaCalcSelectedBoundsService($getCurrentWorkSpace().scene);
    if (!bounds) {
        return ;
    }

    // 中心点うを設定
    const tool = $getActiveTool();
    if (tool.name === $TOOL_ARROW_NAME) {
        // 矢印ツールの場合は選択幅の中心を中心点を設定
    } else {
        // 自由変形ツールなら設定の位置に中心点を設定
    }

    // マウスで移動した量を更新
    const changeSize = $getChangeSize();
    changeSize.w = Math.abs(bounds.xMax - bounds.xMin);
    changeSize.h = Math.abs(bounds.yMax - bounds.yMin);

    // windowのイベントを登録
    transformSettingWidthRegisterWindowEventUseCase();
};