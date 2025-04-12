import { execute } from "./ObjectSettingRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $OBJECT_SETTING_NAME_ID,
    $OBJECT_SETTING_SYMBOL_ID
} from "../../../../config/ObjectSettingConfig";
import { b } from "vitest/dist/chunks/suite.d.FvehnV49.js";


describe("ObjectSettingRegisterEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const nameElement = document.createElement("input");
        nameElement.id = $OBJECT_SETTING_NAME_ID;
        document.body.appendChild(nameElement);

        nameElement.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    expect(type).toBe(EventType.POINTER_DOWN);
                    break;

                case "focusin":
                    expect(type).toBe("focusin");
                    break;

                case "focusout":
                    expect(type).toBe("focusout");
                    break;

                case "keypress":
                    expect(type).toBe("keypress");
                    break;
                    
                default:
                    throw new Error("Invalid event type");
            }
        });

        const symbolElement = document.createElement("input");
        symbolElement.id = $OBJECT_SETTING_SYMBOL_ID;
        document.body.appendChild(symbolElement);

        symbolElement.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    expect(type).toBe(EventType.POINTER_DOWN);
                    break;

                case "focusin":
                    expect(type).toBe("focusin");
                    break;

                case "focusout":
                    expect(type).toBe("focusout");
                    break;

                case "keypress":
                    expect(type).toBe("keypress");
                    break;
                    
                default:
                    throw new Error("Invalid event type");
            }
        });
        
        execute();

        nameElement.remove();
        symbolElement.remove();
    });
});