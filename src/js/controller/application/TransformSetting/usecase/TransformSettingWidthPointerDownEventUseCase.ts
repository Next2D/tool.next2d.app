import { execute as transformSettingWidthPointerMoveEventUseCase } from "./TransformSettingWidthPointerMoveEventUseCase";
import { execute as transformSettingWidthPointerUpEventUseCase } from "./TransformSettingWidthPointerUpEventUseCase";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as transformSettingCacheBeforeMatrixService } from "../service/TransformSettingCacheBeforeMatrixService";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

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
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 親のイベントを止める
    event.stopPropagation();
    if ($useKeyboard()) {
        return ;
    }

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素を解除
    $setEditingElement(null);

    // カーソルが変化しないように設定
    event.preventDefault();

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }
    element.style.cursor = "ew-resize";

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    const bounds = screenAreaCalcSelectedBoundsService(movieClip);
    if (!bounds) {
        return ;
    }

    // 選択中のバウンディングボックスから幅と高さを取得
    const width  = Math.abs(bounds.xMax - bounds.xMin);
    const height = Math.abs(bounds.yMax - bounds.yMin);
    if (width === 0 || height === 0) {
        return ;
    }

    // 変形エリアの幅を設定
    transformSetting.w = width;
    transformSetting.beforeValue = width;

    if (transformSetting.sizeLocked) {
        transformSetting.h = height;
        transformSetting.lockValue = height;
    }

    // 変更前のmatrixを格納
    transformSettingCacheBeforeMatrixService();

    // 中心点を設定
    const tool = $getActiveTool();
    if (tool.name === $TOOL_ARROW_NAME) {
        // 矢印ツールの場合は選択幅の中心を中心点を設定
        referenceSetting.x = bounds.xMin + width / 2;
        referenceSetting.y = bounds.yMin + height / 2;
    } else {
        // 自由変形ツールなら設定の位置に中心点を設定
        if (movieClip.isSingleSelectedOfDisplayObject()) {
            const layer = movieClip.getLayer(
                movieClip.selectedDepths.keys().next().value as number
            );

            if (!layer) {
                return ;
            }

            const depths = movieClip.selectedDepths.values().next().value as number[];
            const character = layer.getCharacter(
                movieClip.currentFrame,
                depths[0]
            );

            if (!character) {
                return ;
            }

            referenceSetting.x = character.referencePosition.x;
            referenceSetting.y = character.referencePosition.y;
        } else {
            referenceSetting.x = bounds.xMin + width / 2;
            referenceSetting.y = bounds.yMin + height / 2;
        }
    }

    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        transformSettingWidthPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        transformSettingWidthPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        transformSettingWidthPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        transformSettingWidthPointerUpEventUseCase
    );
};