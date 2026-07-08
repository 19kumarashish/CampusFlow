export function announcementTemplate(
    title: string,

    message: string,
) {
    return `
        <h2>

        ${title}

        </h2>

        <p>

        ${message}

        </p>
    `;
}