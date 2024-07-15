import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description 追加するDisplayObjectのレイヤーの階層を調整
 *              Adjust the hierarchy of the layer of the DisplayObject to be added
 *
 * @param  {HTMLElement} stage_area_element
 * @param  {HTMLElement} display_element
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    stage_area_element: HTMLElement,
    display_element: HTMLElement,
    layer: Layer
): void => {

    // 同じレイヤーに配置があれば、最後の要素の後に追加
    const elemets = stage_area_element
        .querySelectorAll(`.layer-id-${layer.id}`);

    const length = elemets.length;
    if (length > 1) {

        // 最後の要素を取得、display_elementが含まれるので-2とする
        const targetElement = elemets[length - 2] as HTMLElement;
        if (!targetElement) {
            return ;
        }

        // 最後の要素の後に追加
        targetElement
            .insertAdjacentElement("afterend", display_element);

    } else {

        // 指定のレイヤーの上位レイヤーがないかチャック
        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene;

        const externalLayer = new ExternalLayer(
            workSpace,
            movieClip,
            layer
        );

        const frame = movieClip.currentFrame;
        let index = externalLayer.index - 1;
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

            const elemets = stage_area_element
                .querySelectorAll(`.layer-id-${upperLayer.id}`);

            const length = elemets.length;
            if (!length) {
                continue;
            }

            // 最後の要素の後に追加
            const targetElement = elemets[length - 1] as HTMLElement;
            targetElement
                .insertAdjacentElement("beforebegin", display_element);

            break;
        }
    }
};