export const mapImagesForEdit = (images) => {
    return (images ?? []).map((img) => ({
        ...img,
        preview: img.url,
        isExisting: true,
        file: null,
    }));
};

export const getFeaturedImageIndex = (images) => {
    const index = (images ?? []).findIndex((img) => img.is_featured);
    return index >= 0 ? index : 0;
};
