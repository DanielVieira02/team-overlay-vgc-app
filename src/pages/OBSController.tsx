import { useEffect } from "react";
import { createOBSConnection } from "../lib/obsConnection"

export const OBSController = () => {
    useEffect(() => {
        createOBSConnection();
    }, [])

    return (
        <div>

        </div>
    )
}