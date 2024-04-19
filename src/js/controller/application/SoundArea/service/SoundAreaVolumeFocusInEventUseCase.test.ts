import { execute } from "./SoundAreaVolumeFocusInEventUseCase";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";

describe("SoundAreaVolumeFocusInEventUseCaseTest", () =>
{
    test("test case", () =>
    {

        const eventMock = {
            "stopPropagation": () => {},
            "preventDefault": () => {}
        };

        expect($useKeyboard()).toBe(false);
        execute(eventMock);
        expect($useKeyboard()).toBe(true);
    });
});