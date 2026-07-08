export function resultTemplate(
    sgpa: number,
) {
    return `
        <h2>

        Semester Result

        </h2>

        <p>

        SGPA :

        ${sgpa}

        </p>
    `;
}