/**
 * @description タイムラインのツールエリアのシーン名を更新
 *              Updated scene names in the tool area of the timeline
 *
 * @param  {number} id
 * @param  {string} name
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (id: number, name: string): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById(`scene-instance-id-${id}`);

    if (!element) {
        return ;
    }

    element.textContent = name;
};