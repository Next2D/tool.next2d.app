/**
 * @description SVGタグを生成
 *              Generate SVG tag
 *
 * @param  {string} base64
 * @param  {Float32Array} matrix
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    base64: string,
    matrix: Float32Array
): string => {
    return `<svg xmlns="http://www.w3.org/2000/svg"><image href="${base64}" x="0" y="0" transform="matrix(${matrix.join(" ")})" /></svg>`;
};