import { execute as transformSettingScaleXPointerMoveEventUseCase } from "./TransformSettingScaleXPointerMoveEventUseCase";
import { execute as transformSettingScaleXPointerUpEventUseCase } from "./TransformSettingScaleXPointerUpEventUseCase";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as transformSettingCacheBeforeMatrixService } from "../service/TransformSettingCacheBeforeMatrixService";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";
import { execute as characterGetReferencePositionService } from "@/core/application/Character/service/CharacterGetReferencePositionService";

/**
 * @description 変形エリアのスケールXの変更のポインターダウンイベント
 *              Transformation Area Scale X Pointer Down Event
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

    // 変形エリアの高さを設定
    transformSetting.w = width;
    transformSetting.h = height;

    // 変更前のmatrixを格納
    transformSettingCacheBeforeMatrixService();

    // 中心点を設定
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

        const point = characterGetReferencePositionService(character);
        referenceSetting.x = point.x;
        referenceSetting.y = point.y;
        transformSetting.scaleX = transformSetting.beforeScaleX = character.scaleX;
        transformSetting.scaleY = transformSetting.beforeScaleY = character.scaleY;
    } else {
        referenceSetting.x = bounds.xMin + width / 2;
        referenceSetting.y = bounds.yMin + height / 2;
        transformSetting.scaleX = transformSetting.beforeScaleX = 1;
        transformSetting.scaleY = transformSetting.beforeScaleY = 1;
    }

    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        transformSettingScaleXPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        transformSettingScaleXPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        transformSettingScaleXPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        transformSettingScaleXPointerUpEventUseCase
    );
};