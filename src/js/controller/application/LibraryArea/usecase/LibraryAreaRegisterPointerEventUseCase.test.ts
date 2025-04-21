import { execute } from "./LibraryAreaRegisterPointerEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";
import { $LIBRARY_LIST_BOX_ID } from "../../../../config/LibraryConfig";
import {
    $getMoveOffsetX,
    $setMoveOffsetX,
    $getMoveOffsetY,
    $setMoveOffsetY
} from "../LibraryAreaUtil";

describe("LibraryAreaRegisterPointerEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const listElement = document.createElement("div");
        listElement.id = $LIBRARY_LIST_BOX_ID;
        document.body.appendChild(listElement);

        const mockEvent = {
            "button": 0,
            "target": document.createElement("div"),
            "pointerId": 2,
            "offsetX": 10,
            "offsetY": 20
        } as unknown as PointerEvent;

        const div = document.createElement("div");
        
        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        let pointerLeave = false;

        let pointerId = 0;
        div.setPointerCapture = vi.fn((pointer_id) =>
        {
            pointerId = pointer_id
        });
        div.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_MOVE:
                    pointerMove = true;
                    break;

                case EventType.POINTER_UP:
                    pointerUp = true;
                    break;

                case EventType.POINTER_CANCEL:
                    pointerCancel = true;
                    break;

                case EventType.POINTER_LEAVE:
                    pointerLeave = true;
                    break;

                default:
                    throw new Error("Invalid event type");
            }
        });

        $setMoveOffsetX(0);
        $setMoveOffsetY(0);
        expect(pointerId).toBe(0);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);
        expect(pointerLeave).toBe(false);
        expect($getMoveOffsetX()).toBe(0);
        expect($getMoveOffsetY()).toBe(0);

        execute(mockEvent, div);

        expect(pointerId).toBe(2);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
        expect(pointerLeave).toBe(true);
        expect($getMoveOffsetX()).toBe(10);
        expect($getMoveOffsetY()).toBe(20);

        listElement.remove();
    });
});