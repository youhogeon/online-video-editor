const getExtension = (filename: string) => {
    const parts = filename.split(".");

    return parts[parts.length - 1];
};

const randomString = () => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const charactersLength = characters.length;
    for (let i = 0; i < 50; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

const randomFileName = (extension: string) => {
    return `${randomString()}.${extension}`;
};

export { getExtension, randomFileName };
