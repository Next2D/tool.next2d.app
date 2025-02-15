import { execute } from "./ObjectSettingRegisterEventUseCase";
import {
    $OBJECT_SETTING_NAME_ID,
    $OBJECT_SETTING_SYMBOL_ID
} from "../../../../config/ObjectSettingConfig";
import { describe, expect, it, vi } from "vitest";

describe("ObjectSettingRegisterEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const nameElement = document.createElement("div");
        nameElement.id = $OBJECT_SETTING_NAME_ID;
        document.body.appendChild(nameElement);

        nameElement.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case "focusin":
                    expect(type).toBe("focusin");
                    return;

                case "focusout":
                    expect(type).toBe("focusout");
                    return;

                case "keypress":
                    expect(type).toBe("keypress");
                    return;
                    
                default:
                    throw new Error("Invalid event type");
            }
        });

        const symbolElement = document.createElement("div");
        nameElement.id = $OBJECT_SETTING_SYMBOL_ID;
        document.body.appendChild(symbolElement);

        symbolElement.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case "focusin":
                    expect(type).toBe("focusin");
                    return;

                case "focusout":
                    expect(type).toBe("focusout");
                    return;

                case "keypress":
                    expect(type).toBe("keypress");
                    return;
                    
                default:
                    throw new Error("Invalid event type");
            }
        });
        
        execute();

        nameElement.remove();
        symbolElement.remove();
    });
});