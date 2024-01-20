import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { $getWorkSpace } from "../../CoreUtil";
import { execute as externalWorkSpaceUpdateNameUseCase } from "@/external/core/application/ExternalWorkSpace/usecase/ExternalWorkSpaceUpdateNameUseCase";

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const beforeName = message.data[1] as NonNullable<string>;
    const afterName  = message.data[2] as NonNullable<string>;
    workSpace.name   = beforeName;

    // 名前を更新
    externalWorkSpaceUpdateNameUseCase(workSpace, afterName, true);
};