import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as transformSettingWidthRegisterPointerEventUseCase } from "./TransformSettingWidthRegisterPointerEventUseCase";
import { $getActiveTool } from "@/tool/application/ToolUtil";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { transformSetting } from "@/controller/domain/model/TransformSetting";

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

    // 変更前の値をセット
    transformSetting.w = width;

    // 変更前のmatrixを格納
    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {
        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue;
        }

        for (let idx = 0; idx < depths.length; idx++) {
            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue;
            }

            // 複製を格納
            transformSetting.matrixs.push(character.matrix.slice());
        }
    }

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

            const values = movieClip.selectedDepths.values().next().value as number[];
            const character = layer.getCharacter(
                movieClip.currentFrame,
                values[0]
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

    // windowのイベントを登録
    transformSettingWidthRegisterPointerEventUseCase(event);
};