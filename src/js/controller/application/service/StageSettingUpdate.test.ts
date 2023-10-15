import { execute } from "./StageSettingUpdate";

describe("StageSettingUpdateTest", () =>
{
    test("execute test", () =>
    {
        const stageWidthInput = document.createElement("input");
        stageWidthInput.id = "stage-width";
        stageWidthInput.type = "number";
        document.body.appendChild(stageWidthInput);

        const stageWidth: HTMLInputElement | null = document
            .getElementById("stage-width") as HTMLInputElement;

        if (!stageWidth) {
            throw new Error("not found stage-width element");
        }

        const stageHeightInput = document.createElement("input");
        stageHeightInput.id = "stage-height";
        stageHeightInput.type = "number";
        document.body.appendChild(stageHeightInput);

        const stageHeight: HTMLInputElement | null = document
            .getElementById("stage-height") as HTMLInputElement;

        if (!stageHeight) {
            throw new Error("not found stage-height element");
        }

        const stageFpsInput = document.createElement("input");
        stageFpsInput.id = "stage-fps";
        stageFpsInput.type = "number";
        document.body.appendChild(stageFpsInput);

        const stageFps: HTMLInputElement | null = document
            .getElementById("stage-fps") as HTMLInputElement;

        if (!stageFps) {
            throw new Error("not found stage-fps element");
        }

        const stageColorInput = document.createElement("input");
        stageColorInput.id = "stage-bgColor";
        stageColorInput.type = "color";
        document.body.appendChild(stageColorInput);

        const stageColor: HTMLInputElement | null = document
            .getElementById("stage-bgColor") as HTMLInputElement;

        if (!stageColor) {
            throw new Error("not found stage-bgColor element");
        }

        const stageLockDiv = document.createElement("div");
        stageLockDiv.id = "stage-lock";
        const div = document.createElement("div");
        div.classList.add("disable");
        stageLockDiv.appendChild(div);
        document.body.appendChild(stageLockDiv);

        const stageLock: HTMLElement | null = document
            .getElementById("stage-lock");

        if (!stageLock) {
            throw new Error("not found stage-lock element");
        }

        expect(stageWidth.value).toBe("");
        expect(stageHeight.value).toBe("");
        expect(stageFps.value).toBe("");
        expect(stageColor.value).toBe("#000000");
        expect(div.classList.contains("disable")).toBe(true);

        const stageMock = {
            "width": 100,
            "height": 200,
            "fps": 40,
            "bgColor": "#ff0000",
            "lock": true
        };
        execute(stageMock);

        expect(stageWidth.value).toBe("100");
        expect(stageHeight.value).toBe("200");
        expect(stageFps.value).toBe("40");
        expect(stageColor.value).toBe("#ff0000");
        expect(div.classList.contains("disable")).toBe(false);
        expect(div.classList.contains("active")).toBe(true);

        stageWidthInput.remove();
        stageHeightInput.remove();
        stageFpsInput.remove();
        stageColorInput.remove();
        stageLock.remove();
    });
});