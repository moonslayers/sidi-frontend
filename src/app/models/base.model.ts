export interface BaseModel{
    readonly id:number;
    deleted_at?:string|null;
    created_at?:string;
    updated_at?:string|null;
}