/**
 * @description DisplayObjectのスケールYを計算
 *              Calculate the scale Y of DisplayObject
 *
 * @param  {array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (matrix: number[]): number =>
{
    let yScale: number = Math.sqrt(
        matrix[2] * matrix[2]
        + matrix[3] * matrix[3]
    );

    if (!Number.isInteger(yScale)) {
        const value: string = yScale.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            yScale = +value.slice(0, index);
        }
        yScale = +yScale.toFixed(4);
    }

    return 0 > matrix[3] ? yScale * -1 : yScale;
};