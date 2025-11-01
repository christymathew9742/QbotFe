import api from "@/utils/axios";

const updateTempFilesToPermanent = async (groups: any[], chatbotId: string, setGroups?: (data: any[]) => void) => {
    if (!groups?.length) return groups;

    try {
        const updatedGroups = await Promise.all(
            groups.map(async (group) => {
                if (!group.inputs?.length) return group;

                const updatedInputs = await Promise.all(
                group.inputs.map(async (input: any) => {
                    if (!input.fileData?.length) return input;

                    const updatedFileData = await Promise.all(
                        input.fileData.map(async (file: any) => {
                            if (file.key?.includes("temp/")) {
                                try {
                                    const { data: res } = await api.get(
                                        `/createbots/${chatbotId}/permanent-url`,
                                        { params: { tempKey: file.key, filename: file.name } }
                                    );

                                    if (!res.permanentKey || !res.permanentUrl) {
                                        console.warn(`Skipped file: ${file.key}`);
                                        return { ...file, saveToDb: false };
                                    }

                                    return {
                                        ...file,
                                        key: res.permanentKey,
                                        url: res.permanentUrl,
                                        preview: res.permanentUrl,
                                        saveToDb: true,
                                    };
                                } catch (err: any) {
                                    console.warn(`Failed to move file: ${file.key}`, err.message);
                                    return { ...file, saveToDb: false };
                                }
                            }
                            return file;
                        })
                    );

                    return { ...input, fileData: updatedFileData };
                })
            );

            return { ...group, inputs: updatedInputs };
        })
        );

        if (setGroups) setGroups(updatedGroups);
        console.log("✅ Temp files successfully moved & state updated");
        return updatedGroups;
    } catch (err: any) {
        console.error("❌ Failed to update temp files:", err.message);
        return groups;
    }
};

export default updateTempFilesToPermanent;


