import { execute } from "./PropertyAreaChageStyleToInactiveService";

describe("PropertyAreaChageStyleToInactiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const mockElement = {
            "style": {
                "width": "360px",
                "height": "96vh",
                "left": "10px",
                "top": "20px",
                "zIndex": "16777215",
                "backgroundColor": "#2c2c2c",
                "boxShadow": "0 0 5px rgba(245, 245, 245, 0.25)",
                "position": "fixed"
            },
            "offsetLeft": 10,
            "offsetTop": 20
        };

        expect(mockElement.style.width).toBe("360px");
        expect(mockElement.style.height).toBe("96vh");
        expect(mockElement.style.left).toBe("10px");
        expect(mockElement.style.top).toBe("20px");
        expect(mockElement.style.zIndex).toBe("16777215");
        expect(mockElement.style.backgroundColor).toBe("#2c2c2c");
        expect(mockElement.style.boxShadow).toBe("0 0 5px rgba(245, 245, 245, 0.25)");
        expect(mockElement.style.position).toBe("fixed");

        execute(mockElement);
        expect(mockElement.style.width).toBe("");
        expect(mockElement.style.height).toBe("");
        expect(mockElement.style.left).toBe("");
        expect(mockElement.style.top).toBe("");
        expect(mockElement.style.zIndex).toBe("");
        expect(mockElement.style.backgroundColor).toBe("");
        expect(mockElement.style.boxShadow).toBe("");
        expect(mockElement.style.position).toBe("");
    });
});