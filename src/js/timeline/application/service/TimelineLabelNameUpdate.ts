/**
 * @description タイムラインのラベルの値を更新
 *              Update timeline label values
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (name: string = ""): void =>
{
    // 表示Elementを初期化
    const element: HTMLInputElement | null = document
        .getElementById("label-name") as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = name;
};