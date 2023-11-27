import { execute } from "./PropertyAreaChageStyleToActiveService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { $CONTROLLER_DEFAULT_WIDTH_SIZE } from "../../../../config/ControllerConfig";

describe("PropertyAreaChageStyleToActiveServiceTest", () =>
{
    test("execute test", async () =>
    {
        const workSpace = $createWorkSpace();

        const mockElement = {
            "style": {
                "display": "none",
                "width": "",
                "height": "",
                "left": "",
                "top": "",
                "zIndex": "",
                "backgroundColor": "",
                "boxShadow": "",
                "position": ""
            }
        };

        workSpace.propertyAreaState.state = "move";
        workSpace.propertyAreaState.offsetLeft = 10;
        workSpace.propertyAreaState.offsetTop = 20;

        expect(mockElement.style.display).toBe("none");
        expect(mockElement.style.width).toBe("");
        expect(mockElement.style.height).toBe("");
        expect(mockElement.style.left).toBe("");
        expect(mockElement.style.top).toBe("");
        expect(mockElement.style.zIndex).toBe("");
        expect(mockElement.style.backgroundColor).toBe("");
        expect(mockElement.style.boxShadow).toBe("");
        expect(mockElement.style.position).toBe("");

        execute(mockElement);
        expect(mockElement.style.display).toBe("");
        expect(mockElement.style.width).toBe(`${$CONTROLLER_DEFAULT_WIDTH_SIZE}px`);
        expect(mockElement.style.height).toBe("96vh");
        expect(mockElement.style.left).toBe("10px");
        expect(mockElement.style.top).toBe("20px");
        expect(mockElement.style.zIndex).toBe("16777215");
        expect(mockElement.style.backgroundColor).toBe("#2c2c2c");
        expect(mockElement.style.boxShadow).toBe("0 0 5px rgba(245, 245, 245, 0.25)");
        expect(mockElement.style.position).toBe("fixed");
    });
});