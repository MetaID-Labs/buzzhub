import { useState } from "react";
import { Text, Image, SimpleGrid } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import {
	AttachmentItem,
	FileToAttachmentItem,
	FileToBinaryData,
	compressImage,
} from "@/utils/file";

type Iprops = {
	onChange: (attachments: (string | AttachmentItem)[]) => void;
};

function ImageDropZone({ onChange }: Iprops) {
	const [files, setFiles] = useState<FileWithPath[]>([]);

	const previews = files.map((file, index) => {
		const imageUrl = URL.createObjectURL(file);
		return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
	});

	async function onChooseImage(files: FileWithPath[]) {
		// inputFileRef.value[0].value = "";
		let attachments: AttachmentItem[] = [];

		for (let i = 0; i < files.length; i++) {
			if (attachments.length <= 3) {
				// 压缩图片
				const compressed = await compressImage(files[i]);
				const result = await FileToAttachmentItem(compressed);
				if (result) attachments.push(result);
			} else {
				break;
			}
		}
		// let res: (string | AttachmentItem)[] = getAttachmentsMark(attachments);
		return attachments;
	}

	const onDropImages = async (files: FileWithPath[]) => {
		setFiles(files);
		console.log("on drop", await onChooseImage(files));
		onChange(await onChooseImage(files));
	};

	return (
		<div>
			<Dropzone accept={IMAGE_MIME_TYPE} onDrop={onDropImages} multiple maxFiles={3}>
				<Text ta="center">Drop images here. Multi-file supported.</Text>
			</Dropzone>

			<SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? "xl" : 0}>
				{previews}
			</SimpleGrid>
		</div>
	);
}

export default ImageDropZone;
