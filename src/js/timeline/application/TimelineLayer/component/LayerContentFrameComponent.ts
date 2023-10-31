/**
 * @description タイムラインヘッダーのフレームElementをstringで返却
 *              Return frame Element of the timeline header as string
 *
 * @params {number} layer_id
 * @params {number} frame
 * @return {string}
 * @method
 * @public
 */
export const execute = (layer_id: number, frame: number): string =>
{
    return `
<div class="${frame % 5 !== 0 ? "frame" : "frame frame-pointer"}" data-frame-state="empty" data-layer-id="${layer_id}" data-frame="${frame}"></div>
`;
};