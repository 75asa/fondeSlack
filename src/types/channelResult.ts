export interface channelResult {
    ok?: boolean;
    channel?: channel;
}

export interface channel {
    id?: string;
    name?: string;
    is_channel?: boolean;
    created?: number;
    creator?: string;
    is_archived?: boolean;
    is_general?: boolean;
    name_normalized?: string;
    is_shared?: boolean;
    is_org_shared?: boolean;
    is_member?: boolean;
    is_private?: boolean;
    is_mpim?: boolean;
    last_read?: string;
    latest?: latest;
    unread_count?: number;
    unread_count_display?: number;
    members?: string[];
    topic?: topicOrPurpose;
    purpose?: topicOrPurpose;
    previous_names?: string[];
}

export interface latest {
    text?: string;
    username?: string;
    bot_id?: string;
    attachments?: attachments[];
    type?: string;
    subtype?: string;
    ts?: string;
}

export interface attachments {
    text?: string;
    id?: number;
    fallback?: string;
}

export interface topicOrPurpose {
    value?: string;
    creator?: string;
    last_set?: number;
}
