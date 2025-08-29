// liveblocks.config.ts
declare global {
  interface Liveblocks {
    Presence: {
      id: string;
      status: "active" | "away" | "offline";
    };
    RoomEvent: {
      type: "pay-attention";
    };
  }
}
export {};
