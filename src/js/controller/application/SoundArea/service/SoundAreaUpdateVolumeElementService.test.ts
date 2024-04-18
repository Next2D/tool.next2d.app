import { execute } from "./SoundAreaUpdateVolumeElementService";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "../../../../config/PropertyConfig";
import { SoundObjectImpl } from "../../../../interface/SoundObjectImpl";

describe("SoundAreaUpdateVolumeElementServiceTest", () =>
{
    test("test case", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $SOUND_AREA_SOUND_LIST_AREA_ID;

        const node = document.createElement("div");
        div.appendChild(node);

        const volumeElement = document.createElement("input");
        volumeElement.classList.add("volume");
        volumeElement.value = "100";
        node.appendChild(volumeElement);

        const soundObject: SoundObjectImpl = {
            "libraryId": 2,
            "autoPlay": false,
            "loopCount": 0,
            "volume": 50
        };

        expect(volumeElement.value).toBe("100");
        execute(soundObject, 0);
        expect(volumeElement.value).toBe("50");

        div.remove();
    });
});