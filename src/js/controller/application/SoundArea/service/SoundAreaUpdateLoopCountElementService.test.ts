import { execute } from "./SoundAreaUpdateLoopCountElementService";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "../../../../config/SoundSettingConfig";
import { SoundObjectImpl } from "../../../../interface/SoundObjectImpl";

describe("SoundAreaUpdateLoopCountElementServiceTest", () =>
{
    test("test case", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $SOUND_AREA_SOUND_LIST_AREA_ID;

        const node = document.createElement("div");
        div.appendChild(node);

        const volumeElement = document.createElement("input");
        volumeElement.classList.add("loop-count");
        volumeElement.value = "0";
        node.appendChild(volumeElement);

        const soundObject: SoundObjectImpl = {
            "libraryId": 2,
            "autoPlay": false,
            "loopCount": 10,
            "volume": 100
        };

        expect(volumeElement.value).toBe("0");
        execute(soundObject, 0);
        expect(volumeElement.value).toBe("10");

        div.remove();
    });
});