/**
 * @description DisplayObjectのスケールXを計算
 *              Calculate the scale X of DisplayObject
 *
 * @param  {array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (matrix: number[]): number =>
{
    let xScale: number = Math.sqrt(
        matrix[0] * matrix[0]
        + matrix[1] * matrix[1]
    );
    if (!Number.isInteger(xScale)) {
        const value: string = xScale.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            xScale = +value.slice(0, index);
        }
        xScale = +xScale.toFixed(4);
    }
    return 0 > matrix[0] ? xScale * -1 : xScale;
};