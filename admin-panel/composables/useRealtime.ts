import type { Socket } from "socket.io-client";

interface RealtimeCallbacks {
    onTrafficUpdated?: () => void;
    onAccidentCreated?: () => void;
    onAccidentUpdated?: () => void;
    onAccidentDeleted?: () => void;
    onAirQualityUpdated?: () => void;
    onWaterQualityUpdated?: () => void;
    onPopulationUpdated?: () => void;
    onPublicTransportUpdated?: () => void;
}

export const useRealtime = () => {
    const { $socket } = useNuxtApp();
    const socket = $socket as Socket;

    const subscribe = (callbacks: RealtimeCallbacks) => {
        if (!socket.connected) {
            console.log("🔌 Connecting to WebSocket...");
            socket.connect();
        }

        socket.on("server_push", (msg: any) => {
            console.log("🔔 [Socket] Received:", msg.event);

            switch (msg.event) {
                case "traffic.bulk_updated":
                case "traffic.updated":
                case "traffic.created":
                case "traffic.deleted":
                    callbacks.onTrafficUpdated?.();
                    break;

                case "accident.created":
                    callbacks.onAccidentCreated?.();
                    break;
                case "accident.updated":
                    callbacks.onAccidentUpdated?.();
                    break;
                case "accident.deleted":
                    callbacks.onAccidentDeleted?.();
                    break;

                case "environment.air_quality.created":
                case "environment.air_quality.updated":
                case "environment.air_quality.deleted":
                    callbacks.onAirQualityUpdated?.();
                    break;

                case "environment.water_quality.created":
                case "environment.water_quality.updated":
                case "environment.water_quality.deleted":
                    callbacks.onWaterQualityUpdated?.();
                    break;

                case "population.created":
                case "population.updated":
                case "population.deleted":
                    callbacks.onPopulationUpdated?.();
                    break;

                case "public_transport.created":
                case "public_transport.updated":
                case "public_transport.deleted":
                    callbacks.onPublicTransportUpdated?.();
                    break;
            }
        });
    };

    const unsubscribe = () => {
        socket.off("server_push");
    };

    return {
        socket,
        subscribe,
        unsubscribe,
    };
};
