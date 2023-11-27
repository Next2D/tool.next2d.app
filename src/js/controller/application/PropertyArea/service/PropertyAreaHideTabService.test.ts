import { execute } from "./PropertyAreaHideTabService";
import { $CONTROLLER_TAB_AREA_ID } from "../../../../config/ControllerConfig";

describe("PropertyAreaHideTabServiceTest", () =>
{
    test("execute test", () =>
    {
        const parent = document.createElement("div");
        document.body.appendChild(parent);
        parent.id = $CONTROLLER_TAB_AREA_ID;

        const tab1 = document.createElement("div");
        parent.appendChild(tab1);
        tab1.setAttribute("class", "active");
        tab1.style.display = "";
        tab1.dataset.tabType = "view-test1";

        const viewElement1 = document.createElement("div");
        viewElement1.id = "view-test1";
        document.body.appendChild(viewElement1);

        const tab2 = document.createElement("div");
        parent.appendChild(tab2);
        tab2.setAttribute("class", "disable");
        tab2.style.display = "";
        tab2.dataset.tabType = "view-test2";

        const viewElement2 = document.createElement("div");
        viewElement2.id = "view-test2";
        viewElement2.style.display = "none";
        document.body.appendChild(viewElement2);

        expect(tab1.getAttribute("class")).toBe("active");
        expect(tab1.style.display).toBe("");
        expect(tab2.getAttribute("class")).toBe("disable");
        expect(viewElement2.style.display).toBe("none");

        execute();

        expect(tab1.getAttribute("class")).toBe("disable");
        expect(tab1.style.display).toBe("none");
        expect(tab2.getAttribute("class")).toBe("active");
        expect(viewElement2.style.display).toBe("");

        parent.remove();
        viewElement1.remove();
        viewElement2.remove();
    });
});