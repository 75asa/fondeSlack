export interface userResult {
    profile: object;
    title: string;
    real_name: string;
    display_name: string;
    fields: object;
    status_text: string;
    first_name: string;
    last_name: string;
}

export interface fields {
    fieldId?: {
        value?: string;
        alt?: string;
    };
}
