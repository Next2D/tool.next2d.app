/**
 * @description タイムラインヘッダーのフレームElementをstringで返却
 *              Return frame Element of the timeline header as string
 *
 * @params {number} index
 * @params {number} frame
 * @return {string}
 * @method
 * @public
 */
export const execute = (index: number, frame: number): string =>
{
    return `
<div class="${frame % 5 !== 0 ? "frame" : "frame frame-pointer"}" data-frame-state="empty" data-layer-index="${index}" data-frame="${frame}"></div>
`;
};