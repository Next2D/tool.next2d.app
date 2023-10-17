
import { execute as toolInitializeUseCase } from "./ToolArea/usecase/ToolAreaInitializeUseCase";

/**
 * @description ツールエリアの初期起動関数
 *              Initial startup function of the tool area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    // 初期起動時のユースケース
    return new Promise((resolve): void =>
    {
        toolInitializeUseCase()
            .then((): void =>
            {
                resolve();
            });
    });
};