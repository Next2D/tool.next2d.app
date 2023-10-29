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
    <div class="frame-sec ${frame % 5 === 0 ? "frame-border-end" : "frame-border"}" data-frame="${frame}"></div>
    <div class="frame-border-box" data-type="marker" data-frame="${frame}"></div>
    <div class="frame-border-box" data-type="action" data-frame="${frame}"></div>
    <div class="frame-border-box" data-type="sound" data-frame="${frame}"></div>
    <div class="frame-number" data-frame="${frame}">${frame % 5 === 0 ? frame : ""}</div>
</div>
`;
};