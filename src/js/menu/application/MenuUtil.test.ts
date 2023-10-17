import {
    $registerMenu,
    $getMenu,
    $getMenuAll,
    $allHide
} from "./MenuUtil";

describe("MenuTest", () =>
{
    test("$registerMenu and $getMenu and $getMenuAll test", () =>
    {
        const mock1 = {
            "name": "mock1"
        };

        const mock2 = {
            "name": "mock2"
        };

        $registerMenu(mock1);
        $registerMenu(mock2);
        expect($getMenu("mock1")).toBe(mock1);
        expect($getMenu("mock2")).toBe(mock2);

        const menus = $getMenuAll();
        expect(menus.size).toBe(2);
    });

    test("$allHide test", () =>
    {
        let mock1State = "show";
        const mock1 = {
            "name": "mock1",
            "hide": () =>
            {
                mock1State = "hide";
            }
        };

        let mock2State = "show";
        const mock2 = {
            "name": "mock2",
            "hide": () =>
            {
                mock2State = "hide";
            }
        };

        expect(mock1State).toBe("show");
        expect(mock2State).toBe("show");
        $registerMenu(mock1);
        $registerMenu(mock2);

        $allHide();
        expect(mock1State).toBe("hide");
        expect(mock2State).toBe("hide");
    });
});