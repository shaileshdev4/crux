declare const pendo: {
  initialize(options: { visitor: { id: string }; account?: { id: string } }): void;
  identify?(options: { visitor: { id: string } }): void;
  track(event: string, properties?: Record<string, unknown>): void;
};
