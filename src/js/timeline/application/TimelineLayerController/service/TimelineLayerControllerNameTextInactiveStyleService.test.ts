import { execute } from "./TimelineLayerControllerNameTextInactiveStyleService";

describe("TimelineLayerControllerNameTextInactiveStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const nameElement = document.createElement("div");
        nameElement.textContent = "test";
        nameElement.dataset.layerIndex = "0";
        nameElement.contentEditable = "true";
        nameElement.style.borderBottom = "1px solid #f5f5f5";

        const eventMock = {
            "target": nameElement
        };

        expect(nameElement.contentEditable).toBe("true");
        expect(nameElement.style.borderBottom).toBe("1px solid #f5f5f5");

        execute(eventMock);

        expect(nameElement.contentEditable).toBe("false");
        expect(nameElement.style.borderBottom).toBe("");
    });
});