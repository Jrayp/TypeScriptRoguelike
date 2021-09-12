export default interface IActivatable {
    get isActive(): boolean;
    activate(): void;
    toggle(): boolean;
    deactivate(): void;
}