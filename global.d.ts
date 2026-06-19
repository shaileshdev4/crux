declare const pendo: {
  initialize(options: { visitor: { id: string; [key: string]: unknown }; account?: { id: string; [key: string]: unknown } }): void;
  identify?(options: { visitor: { id: string; [key: string]: unknown }; account?: { id: string; [key: string]: unknown } }): void;
  pageLoad(): void;
  track(event: string, properties?: Record<string, unknown>): void;
};
