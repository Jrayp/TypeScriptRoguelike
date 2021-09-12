export default interface IActivatable {
    isActive(): boolean;
    activate(): void;
    toggle(): boolean;
    deactivate(): void;
}