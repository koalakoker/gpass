export interface Refreshable {
    refresh: (string) => Promise<string>;
}