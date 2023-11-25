// import { $SCREEN_MENU_NAME } from "../../../../config/MenuConfig";
// import { $registerMenu } from "../../MenuUtil";
// import { execute } from "./ScreenMenuShowSubMenuService";

describe("ScreenMenuShowSubMenuServiceTest", () =>
{
    test("execute test", () =>
    {
        // const orderElement = document.createElement("div");
        // document.body.appendChild(orderElement);
        // orderElement.id = "screen-order";

        // let orderState = "hide";
        // const orderMenuMock = {
        //     "name": "screen-order-menu",
        //     "show": () => {
        //         orderState = "show";
        //     },
        //     "hide": () =>
        //     {
        //         orderState = "hide";
        //     },
        //     "offsetLeft": 0,
        //     "offsetTop": 0
        // };
        // $registerMenu(orderMenuMock);

        // const alignElement = document.createElement("div");
        // document.body.appendChild(alignElement);
        // alignElement.id = "screen-align";

        // let alignState = "hide";
        // const alignMenuMock = {
        //     "name": "screen-align-menu",
        //     "show": () => {
        //         alignState = "show";
        //     },
        //     "hide": () =>
        //     {
        //         alignState = "hide";
        //     },
        //     "offsetLeft": 0,
        //     "offsetTop": 0
        // };
        // $registerMenu(alignMenuMock);

        // let state = "on";
        // const eventMock = {
        //     "stopPropagation": () =>
        //     {
        //         state = "off";
        //     },
        //     "target": null,
        //     "offsetLeft": 100,
        //     "offsetTop": 200
        // };

        // const parent = document.createElement("div");
        // document.body.appendChild(parent);
        // parent.id = $SCREEN_MENU_NAME;

        // expect(orderMenuMock.offsetLeft).toBe(0);
        // expect(orderMenuMock.offsetTop).toBe(0);
        // expect(alignMenuMock.offsetLeft).toBe(0);
        // expect(alignMenuMock.offsetTop).toBe(0);
        // expect(alignState).toBe("hide");
        // expect(orderState).toBe("hide");
        // expect(state).toBe("on");

        // // 表示順を表示
        // eventMock.target = alignElement;
        // execute(eventMock);
        // expect(orderMenuMock.offsetLeft).toBe(0);
        // expect(orderMenuMock.offsetTop).toBe(0);
        // expect(alignMenuMock.offsetLeft).toBe(-5);
        // expect(alignMenuMock.offsetTop).toBe(20);
        // expect(alignState).toBe("show");
        // expect(orderState).toBe("hide");
        // expect(state).toBe("off");

        // // 整列を表示
        // eventMock.target = orderElement;
        // execute(eventMock);
        // expect(orderMenuMock.offsetLeft).toBe(-5);
        // expect(orderMenuMock.offsetTop).toBe(20);
        // expect(alignMenuMock.offsetLeft).toBe(-5);
        // expect(alignMenuMock.offsetTop).toBe(20);
        // expect(alignState).toBe("hide");
        // expect(orderState).toBe("show");
        // expect(state).toBe("off");

        // parent.remove();
        // alignElement.remove();
        // orderElement.remove();
    });
});