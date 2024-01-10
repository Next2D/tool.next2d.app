import { $getSocket, $isSocketOwner } from "../ShareUtil";

export const execute = (event: MessageEvent): void =>
{
    const message = JSON.parse(event.data);
    console.log("message", message);

    switch (message.command) {

        case "initialize":
            if ($isSocketOwner()) {

                const webSocket = $getSocket();
                if (!webSocket) {
                    return ;
                }

                console.log("your owner.");
                webSocket.send(JSON.stringify({
                    "to": message.FROM,
                    "data": { "work_space_data": true },
                    "command": "load"
                }));
            }
            break;

        case "load":
            if (!$isSocketOwner()) {
                //
            }
            break;

        default:
            break;

    }
};