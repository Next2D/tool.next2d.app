import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description 移動したレイヤーに配置したDisplayObjectのレイヤーの階層を調整
 *              Adjust the hierarchy of the layer of the DisplayObject placed on the moved layer
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // 指定のレイヤーの上位レイヤーがないかチャック
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 表示されてるキャラクターを取得
    const activeCharacters = layer.getActiveCharacters(movieClip.currentFrame);
    if (!activeCharacters.length) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    // 移動したレイヤーに配置したDisplayObjectのElementを取得
    const elemets = element
        .querySelectorAll(`.layer-id-${layer.id}`);

    const externalLayer = new ExternalLayer(
        workSpace,
        movieClip,
        layer
    );

    let index = externalLayer.index - 1;
    if (index === -1) {
        const length = elemets.length;
        for (let idx = 0; length > idx; ++idx) {

            const moveElement = elemets[idx] as HTMLElement;
            if (!moveElement) {
                continue;
            }

            // 移動先の上位レイヤーの下位レイヤーに配置
            element.appendChild(moveElement);
        }
        return ;
    }

    const frame = movieClip.currentFrame;
    while (index > -1) {

        const upperLayer = movieClip.getLayer(index--);
        if (!upperLayer) {
            continue;
        }

        // 表示されてるキャラクターを取得、何も配置されていなければ終了
        const activeCharacters = upperLayer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            continue;
        }

        const upperElemets = element
            .querySelectorAll(`.layer-id-${upperLayer.id}`);

        const length = upperElemets.length;
        if (!length) {
            continue;
        }

        // 最後の要素の後に追加
        const targetElement = upperElemets[length - 1] as HTMLElement;
        for (let idx = elemets.length - 1; idx > -1; --idx) {

            const moveElement = elemets[idx] as HTMLElement;
            if (!moveElement) {
                continue;
            }

            // 移動先の上位レイヤーの下位レイヤーに配置
            targetElement
                .insertAdjacentElement("beforebegin", moveElement);
        }

        break;
    }
};