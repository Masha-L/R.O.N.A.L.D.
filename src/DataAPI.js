import database from "./database"

export const getTitles = () => {
        return database.docs;
    }
