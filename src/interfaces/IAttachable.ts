import IPositional from "./IPositional";

export default interface IAttachable {
    get attachedTo(): IPositional | undefined;
    attach(positional: IPositional): void;
    detach(): void;
}