import { $SCREEN_TAB_NAME_UPDATE_COMMAND } from "@/config/HistoryConfig";
import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { execute as workSpaceReceiveUpdateNameUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceReceiveUpdateNameUseCase";

/**
 * @description 共有者からの作業履歴の受け取り
 *              Receive work history from co-owners
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    switch (message.historyCommand) {

        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            workSpaceReceiveUpdateNameUseCase(message);
            break;

        default:
            break;

    }
};