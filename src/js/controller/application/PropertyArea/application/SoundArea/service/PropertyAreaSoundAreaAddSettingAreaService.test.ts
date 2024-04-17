import { execute } from "./PropertyAreaSoundAreaAddSettingAreaService";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "../../../../../../config/PropertyConfig";
import type { SoundObjectImpl } from "../../../../../../interface/SoundObjectImpl";

describe("PropertyAreaSoundAreaAddSettingAreaServiceTest", () =>
{
    test("test case", () =>
    {
        const element = document.createElement("div");
        element.id = $SOUND_AREA_SOUND_LIST_AREA_ID;
        document.body.appendChild(element);

        const sound: SoundObjectImpl = {
            "libraryId": 0,
            "autoPlay": false,
            "loopCount": 0,
            "volume": 100
        };

        expect(element.children.length).toBe(0);
        execute(0, "Sound_01", sound);
        expect(element.children.length).toBe(1);

        element.remove();
    });
});