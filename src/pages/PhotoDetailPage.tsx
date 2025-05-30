import { css } from "../styled-system/css";

export const PhotoDetailPage = () => {
    return (
        <div
            className={css({
                fontSize: "3xl",
                fontWeight: "bold",
                mb: "6",
                textAlign: "center",
                color: "blue.500",
            })}
        >
            <h1>Photo Detail</h1>
            <p>This is the photo detail page.</p>
        </div>
    );
};