import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $poolCanvas } from "@/global/GlobalUtil";
import { $setReDrawState } from "../../ScreenArea/ScreenAreaUtil";
import { execute as shapeCreateDisplayObjectElementUseCase } from "@/core/application/Shape/usecase/ShapeCreateDisplayObjectElementUseCase";
import { $SHAPE_TYPE } from "@/config/InstanceConfig";

/**
 * @description 指定ライブラリのDisplayObjectのElementを入れ替える
 *              Replace the Element of the specified library's DisplayObject
 *
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = async (library_id: number): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const instance = workSpace.getLibrary(library_id);
    if (!instance) {
        return ;
    }

    const movieClip = workSpace.scene;
    const frame = movieClip.currentFrame;
    for (let idx = 0; idx < movieClip.layers.length; ++idx) {
        const layer = movieClip.layers[idx];
        if (!layer) {
            continue;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            continue;
        }

        const elements = element
            .querySelectorAll(`layer-id-${layer.id}`);

        for (let idx = 0; idx < activeCharacters.length; ++idx) {

            const character = activeCharacters[idx];
            if (!character) {
                continue;
            }

            if (character.libraryId !== library_id) {
                continue;
            }

            const node = elements[character.depth];
            if (!node) {
                continue;
            }

            // 既存のcanvasをキャッシュに戻す
            const canvas = node.children[0] as HTMLCanvasElement;
            if (canvas) {
                $poolCanvas(canvas);
            }

            // 既存のElementを削除
            node.remove();

            // 変更前のShapeを描画したelementを再配置
            $setReDrawState(true);
            switch (instance.type) {

                case $SHAPE_TYPE:
                    await shapeCreateDisplayObjectElementUseCase(
                        workSpace.id,
                        instance,
                        element,
                        layer,
                        character
                    );
                    break;

                default:
                    break;

            }
            $setReDrawState(false);
        }

    }
};