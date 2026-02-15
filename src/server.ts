import { createServer, communicationTools } from "staruml-controller-mcp-core"

export function createCommunicationServer() {
    return createServer("staruml-controller-communication", "1.0.0", communicationTools)
}
