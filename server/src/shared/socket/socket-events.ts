export const SocketEvents = {
    CONNECT: "connect",

    DISCONNECT: "disconnect",

    JOIN: "join",

    NOTIFICATION: "notification",

    NOTIFICATION_COUNT: "notification_count",

    ANNOUNCEMENT: "announcement",

    RESULT_PUBLISHED:
        "result-published",

    ASSIGNMENT_GRADED:
        "assignment-graded",
} as const;