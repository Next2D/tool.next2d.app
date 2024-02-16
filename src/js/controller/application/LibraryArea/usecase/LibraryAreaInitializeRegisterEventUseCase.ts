import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { execute as libraryAreaMouseDownEventUseCase } from "./LibraryAreaMouseDownEventUseCase";
import { execute as libraryAreaDropUseCase } from "./LibraryAreaDropUseCase";
import { execute as libraryAreaDragoverService } from "../service/LibraryAreaDragoverService";
import { EventType } from "@/tool/domain/event/EventType";

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

    element.addEventListener(EventType.MOUSE_DOWN,
        libraryAreaMouseDownEventUseCase
    );

    element.addEventListener("dragover", libraryAreaDragoverService);
    element.addEventListener("drop", libraryAreaDropUseCase);
    element.addEventListener("dragstart", () =>
    {
        // TODO stage-areaのアイテムのイベントを無効化
    });
    element.addEventListener("dragend", () =>
    {
        // TODO stage-areaのアイテムのイベントを無効化を解除
    });
};