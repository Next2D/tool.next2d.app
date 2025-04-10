import { execute } from "./StageSettingInitializeRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $STAGE_BG_COLOR_ID,
    $STAGE_FPS_ID,
    $STAGE_HEIGHT_ID,
    $STAGE_LOCK_ID,
    $STAGE_WIDTH_ID
} from "../../../../config/StageSettingConfig";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("StageSettingInitializeRegisterEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const element = document.createElement("div");
        element.id = $STAGE_LOCK_ID;
        document.body.appendChild(element);

        let pointerDown = false;
        element.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                pointerDown = true;
            } else {
                throw new Error("Unknown event type");
            }
        });

        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        element.remove();
    });

    it("execute test case2", () =>
    {
        const element = document.createElement("div");
        element.id = $STAGE_WIDTH_ID;
        document.body.appendChild(element);

        let pointerDown = false;
        let pointerOver = false;
        let pointerOut = false;
        let focusin = false;
        let focusout = false;
        let keypress = false;

        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_OVER:
                    pointerOver = true;
                    break;

                case EventType.POINTER_OUT:
                    pointerOut = true;
                    break;

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    break;
                
                case "focusin":
                    focusin = true;
                    break;

                case "focusout":
                    focusout = true;
                    break;

                case "keypress":
                    keypress = true;
                    break;

                default:
                    throw new Error("Unknown event type");
            }
        });

        expect(pointerDown).toBe(false);
        expect(pointerOver).toBe(false);
        expect(pointerOut).toBe(false);
        expect(focusin).toBe(false);
        expect(focusout).toBe(false);
        expect(keypress).toBe(false);
        
        execute();

        expect(pointerDown).toBe(true);
        expect(pointerOver).toBe(true);
        expect(pointerOut).toBe(true);
        expect(focusin).toBe(true);
        expect(focusout).toBe(true);
        expect(keypress).toBe(true);

        element.remove();
    });

    it("execute test case3", () =>
    {
        const element = document.createElement("div");
        element.id = $STAGE_HEIGHT_ID;
        document.body.appendChild(element);

        let pointerDown = false;
        let pointerOver = false;
        let pointerOut = false;
        let focusin = false;
        let focusout = false;
        let keypress = false;
    
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_OVER:
                    pointerOver = true;
                    break;

                case EventType.POINTER_OUT:
                    pointerOut = true;
                    break;

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    break;
                
                case "focusin":
                    focusin = true;
                    break;

                case "focusout":
                    focusout = true;
                    break;

                case "keypress":
                    keypress = true;
                    break;

                default:
                    throw new Error("Unknown event type");
            }
        });

        expect(pointerDown).toBe(false);
        expect(pointerOver).toBe(false);
        expect(pointerOut).toBe(false);
        expect(focusin).toBe(false);
        expect(focusout).toBe(false);
        expect(keypress).toBe(false);
        
        execute();

        expect(pointerDown).toBe(true);
        expect(pointerOver).toBe(true);
        expect(pointerOut).toBe(true);
        expect(focusin).toBe(true);
        expect(focusout).toBe(true);
        expect(keypress).toBe(true);

        element.remove();
    });

    it("execute test case4", () =>
    {
        const element = document.createElement("div");
        element.id = $STAGE_BG_COLOR_ID;
        document.body.appendChild(element);

        let change = false;
        let pointerDown = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    break;

                case "change":
                    change = true;
                    break;

                default:
                    throw new Error("Unknown event type");
            }
        });

        expect(change).toBe(false);
        expect(pointerDown).toBe(false);
        
        execute();

        expect(change).toBe(true);
        expect(pointerDown).toBe(true);

        element.remove();
    });

    it("execute test case5", () =>
    {
        const element = document.createElement("div");
        element.id = $STAGE_FPS_ID;
        document.body.appendChild(element);

        let pointerDown = false;
        let pointerOver = false;
        let pointerOut = false;
        let focusin = false;
        let focusout = false;
        let keypress = false;
    
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_OVER:
                    pointerOver = true;
                    break;
    
                case EventType.POINTER_OUT:
                    pointerOut = true;
                    break;

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    break;
                
                case "focusin":
                    focusin = true;
                    break;

                case "focusout":
                    focusout = true;
                    break;

                case "keypress":
                    keypress = true;
                    break;

                default:
                    throw new Error("Unknown event type");
            }
        });
    
        expect(pointerDown).toBe(false);
        expect(pointerOver).toBe(false);
        expect(pointerOut).toBe(false);
        expect(focusin).toBe(false);
        expect(focusout).toBe(false);
        expect(keypress).toBe(false);
        
        execute();

        expect(pointerDown).toBe(true);
        expect(pointerOver).toBe(true);
        expect(pointerOut).toBe(true);
        expect(focusin).toBe(true);
        expect(focusout).toBe(true);
        expect(keypress).toBe(true);

        element.remove();
    });
});