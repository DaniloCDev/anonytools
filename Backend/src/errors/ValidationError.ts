export class ValidationError extends Error {
    public errors: any[];

    constructor(zodError: any) {
        super("Erro de validação");
        this.name = "ValidationError";
        this.errors = zodError.errors ?? [];
    }
}
