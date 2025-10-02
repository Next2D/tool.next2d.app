/**
 * @description SVGタグを生成
 *              Generate SVG tag
 *
 * @param  {string} base64
 * @param  {number} width
 * @param  {number} height
 * @param  {number} image_width
 * @param  {number} image_height
 * @param  {Float32Array} matrix
 * @return {string}
 * @method
 * @public
 */
export const execute = (
    base64: string,
    width: number,
    height: number,
    image_width: number,
    image_height: number,
    matrix: Float32Array
): string => {
    const cx = image_width / 2;
    const cy = image_height / 2;
    matrix[4] = width / 2 - matrix[0] * cx - matrix[2] * cy;
    matrix[5] = height / 2 - matrix[1] * cx - matrix[3] * cy;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><image href="${base64}" width="${image_width}" height="${image_height}" transform="matrix(${matrix.join(" ")})" /></svg>`;
};