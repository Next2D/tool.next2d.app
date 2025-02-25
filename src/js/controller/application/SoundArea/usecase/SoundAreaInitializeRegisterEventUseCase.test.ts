import { execute } from "./SoundAreaInitializeRegisterEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $SOUND_AREA_ADD_SOUND_ID,
    $SOUND_AREA_SELECT_ID
} from "../../../../config/SoundSettingConfig";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaInitializeRegisterEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SOUND_AREA_ADD_SOUND_ID;

        let divPointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            switch (type) {
                
                case EventType.POINTER_DOWN:
                    divPointerDown = true;
                    break;

                default:
                    throw new Error("Invalid event type");
            }
        });
        document.body.appendChild(div);

        const select = document.createElement("select");
        select.id = $SOUND_AREA_SELECT_ID;

        let selectPointerDown = false;
        select.addEventListener = vi.fn((type) =>
        {
            switch (type) {
                
                case EventType.POINTER_DOWN:
                    selectPointerDown = true;
                    break;

                default:
                    throw new Error("Invalid event type");
            }
        });
        document.body.appendChild(select);

        expect(divPointerDown).toBe(false);
        expect(selectPointerDown).toBe(false);
        execute();
        expect(divPointerDown).toBe(true);
        expect(selectPointerDown).toBe(true);

        div.remove();
        select.remove();
    });
});