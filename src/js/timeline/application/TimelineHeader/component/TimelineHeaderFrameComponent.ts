/**
 * @description タイムラインヘッダーのフレームElementをstringで返却
 *              Return frame Element of the timeline header as string
 *
 * @params {number} frame
 * @return {string}
 * @method
 * @public
 */
export const execute = (frame: number): string =>
{
    return `
<div class="frame-header-parent" data-frame="${frame}">
    <div class="frame-sec ${frame % 5 === 0 ? "frame-border-end" : "frame-border"}"></div>
    <div class="frame-border-box"></div>
    <div class="frame-border-box"></div>
    <div class="frame-border-box"></div>
    <div class="frame-number">${frame % 5 === 0 ? frame : ""}</div>
</div>
`;
};