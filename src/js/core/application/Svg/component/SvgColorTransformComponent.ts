import type { Character } from "@/core/domain/model/Character";

/**
 * @description 指定されたCharacterのColorTransform用のSVGフィルターを生成して返却
 *              Generate and return an SVG filter for the ColorTransform of the specified Character
 *
 * @param  {Character} character
 * @param  {number} layer_id
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    character: Character,
    layer_id: number
): string => {

    const colorTransform = character.colorTransform;
    return `<svg width="0" height="0">
    <filter id="color-transform-${layer_id}-${character.id}" color-interpolation-filters="linearRGB">
        <feComponentTransfer>
            <feFuncR id="fx-r-${layer_id}-${character.id}" type="linear" slope="${colorTransform[0]}" intercept="${colorTransform[4] / 255}"/>
            <feFuncG id="fx-g-${layer_id}-${character.id}" type="linear" slope="${colorTransform[1]}" intercept="${colorTransform[5] / 255}"/>
            <feFuncB id="fx-b-${layer_id}-${character.id}" type="linear" slope="${colorTransform[2]}" intercept="${colorTransform[6] / 255}"/>
        </feComponentTransfer>
    </filter>
</svg>`;
};