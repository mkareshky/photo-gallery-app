import React from "react";
import { css } from "../styled-system/css";

export const GalleryPage: React.FC = () => {

    return (
        <>
            <main
                className={css({
                    px: "4",
                    py: "6",
                    maxW: "7xl",
                    mx: "auto",
                })}
            >
                <h1
                    className={css({
                        fontSize: "3xl",
                        fontWeight: "bold",
                        mb: "6",
                        textAlign: "center",
                    })}
                >
                    Photo Gallery
                </h1>
            </main>
        </>
    );
};
