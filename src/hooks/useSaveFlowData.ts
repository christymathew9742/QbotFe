import { useCallback } from "react";
import useUpdateTempFiles from "./useUpdateTempFiles";

export const useSaveFlowData = ({
    reactFlowInstance,
    dispatch,
    chatbotId,
    title,
    isTitleEmpt,
    toast,
    postBotRequest,
    updateBotRequest,
    POST_BOT_REQUEST,
    UPDATE_BOT_REQUEST,
    isFileType,
}: any) => {

    const sanitizeNode = (node: any) => {
        const { setInputs, deleteField, ...restData } = node.data || {};
        return {
            ...node,
            data: {
                ...restData,
                inputs:
                node.data?.inputs?.map((input: any) => {
                    if (input.editor) {
                        const { editor, ...rest } = input;
                        return {
                            ...rest,
                            options: input.options?.map((opt: any) => ({ ...opt })) || [],
                        };
                    }
                    return input;
                }) || [],
            },
        };
    };

    const isEmptyField = (data: any): boolean => {
        if (!Array.isArray(data?.inputs) || data.inputs.length === 0) return false;
        return data.inputs.every(({ value, type, slots, options, fileData }: any) => {
            const content =
                new DOMParser().parseFromString(value || "", "text/html").body
                .textContent?.trim() || "";

            const isSlotValid = type === "Slot" && Array.isArray(slots) && slots.length > 0;
            const isListOrButtonValid =
                (type === "List" || type === "Button") &&
                Array.isArray(options) &&
                options.every((opt) => opt.value?.trim() !== "");
            const isFileValid = isFileType(type) && Array.isArray(fileData) && fileData.length > 0;
            const isTextValid = content.length > 0;

            return isSlotValid || isListOrButtonValid || isFileValid || isTextValid;
        });
    };

    const sanitizeFlowData = (flowData: any) => ({
        ...flowData,
        title,
        nodes: flowData.nodes.map((node: any) => sanitizeNode(node)),
        edges: flowData.edges.map((edge: any) => ({ ...edge })),
        status: true,
        viewport: {
            x: flowData.viewport?.x ?? 0,
            y: flowData.viewport?.y ?? 0,
            zoom: flowData.viewport?.zoom ?? 1,
        },
    });

    const mergeFileData = (botData: any, updatedData: any) => {
        const updatedNodes = botData.nodes.map((node: any) => {
            const updatedNode = updatedData.find((u: any) => u.label === node.data.label);
            if (!updatedNode) return node;

            const updatedInputs = node.data.inputs.map((input: any) => {
                const matchedInput = updatedNode.inputs.find((u: any) => u.id === input.id);
                if (!matchedInput) return input;
                return {
                    ...input,
                    fileData: matchedInput.fileData || input.fileData,
                };
            });

            return {
                ...node,
                data: {
                    ...node.data,
                    inputs: updatedInputs,
                },
            };
        });

        return { ...botData, nodes: updatedNodes };
    };

    const saveData = useCallback(async () => {
        if (!reactFlowInstance?.current) {
            console.error("React Flow instance is not available");
            return false;
        }

        const flowData = reactFlowInstance.current.toObject();
        const sanitizedData = sanitizeFlowData(flowData);
        let botData = { ...sanitizedData };

        const data = flowData.nodes.map((node: any) => node.data);
        const allValid =
        flowData.nodes.length > 0 &&
        flowData.nodes.every((node: any) => isEmptyField(node.data));

        if (isTitleEmpt) {
            toast.error("The title cannot be empty");
            return  false;
        }

        if (!allValid) {
            toast.error("The node or its fields are empty.");
            return false;
        }

        try {
            const updatedFileData = await useUpdateTempFiles(data, chatbotId);
            botData = mergeFileData(botData, updatedFileData);
            reactFlowInstance.current.setNodes((prevNodes: any[]) =>
                prevNodes.map((node) => {
                    const updatedNode = botData.nodes.find((n: any) => n.id === node.id);
                    return updatedNode
                        ? { ...node, data: { ...node.data, inputs: updatedNode.data.inputs } }
                        : node;
                })
            );

            const action = chatbotId
                ? updateBotRequest({ id: chatbotId, payload: { ...botData } })
                : postBotRequest({ ...botData });

            const result = await dispatch(action);

            switch (result.type) {
                case POST_BOT_REQUEST:
                    toast.success("Saved successfully.");
                    return true
                case UPDATE_BOT_REQUEST:
                    toast.success("Updated successfully.");
                    return true
                default:
                    toast.error("Error saving data.");
                    return false;
            }
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Error saving data.");
            return false;
        }
    }, [
        reactFlowInstance,
        dispatch,
        chatbotId,
        title,
        isTitleEmpt,
        toast,
        postBotRequest,
        updateBotRequest,
        POST_BOT_REQUEST,
        UPDATE_BOT_REQUEST,
    ]);

    return { saveData };
};



