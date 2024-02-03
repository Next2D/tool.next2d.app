import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { execute as libraryAreaDragoverService } from "../service/LibraryAreaDragoverService";
import { execute as libraryAreaDropUseCase } from "./LibraryAreaDropUseCase";

/**
 * @description ライブラリエリアのイベントを登録
 *              Register an event in the library area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (!element) {
        return ;
    }

    element.addEventListener("dragover", libraryAreaDragoverService);
    element.addEventListener("drop", libraryAreaDropUseCase);
};