import { Box, Button, LoadingOverlay, Modal, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import cls from "classnames";
import { isNil } from "ramda";
import buzzLogo from "@/assets/buzzhub-logo.png";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import ImageDropZone from "./ImageDropZone";
import { AttachmentItem } from "@/utils/file";

type IProps = {
	handlePost: (content: string, attachments?: AttachmentItem[]) => void;
	isBuzzPosting: boolean;
	baseConnector: any;
};

const BuzzForm = ({ handlePost, isBuzzPosting, baseConnector }: IProps) => {
	const [showCreate, showCreateHandler] = useDisclosure(false);

	const form = useForm<{ content: string; attachments: AttachmentItem[] }>({
		initialValues: {
			content: "",
			attachments: [],
		},
	});
	// console.log("isbuzz creating", isBuzzPosting);
	const onStartCreate = () => {
		// console.log("bbc", baseConnector);
		if (isNil(baseConnector)) {
			toast.warn("Please login to publish a buzz!");

			return;
		}
		if (isNil(baseConnector?.metaid)) {
			toast.warn("Please create metaid to publish a buzz!");

			return;
		}

		showCreateHandler.open();
	};

	const handleBuzzSubmit = async (values: { content: string; attachments: AttachmentItem[] }) => {
		await handlePost(values.content, values?.attachments);
		form.setValues({
			content: "",
			attachments: [],
		});
		if (!isBuzzPosting) {
			showCreateHandler.close();
		}
	};
	return (
		<>
			<div className="flex md:mx-[30%] mx-3 space-x-2 py-8 border-b border-[#CEE0E8]">
				<img src={buzzLogo} alt="buzzlogo" className="w-[30px] h-[30px]" />
				<div className="flex-1">
					<div>
						<div className="title">BuzzHub</div>
						<div className="desc">
							An open source twitter-like DApp based on MetaID and MVC.
						</div>
					</div>
					<TextInput
						classNames={{ root: "mt-5", input: "border-0" }}
						size="lg"
						radius="md"
						placeholder="Say Something..."
						onClick={onStartCreate}
					/>
				</div>
			</div>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<Modal
				centered
				withCloseButton={false}
				opened={showCreate}
				onClose={showCreateHandler.close}
				title="✒️ New Buzz"
				classNames={{
					content: "!rounded-xl",
					body: "!p-[30px]",
					header: "!py-[30px] !mx-[30px] !border-b !border-[#00000008] !flex !justify-center",
					title: "!text-[24px]",
					inner: "!px-[60px]",
				}}
			>
				<Box pos="relative">
					<LoadingOverlay
						visible={isBuzzPosting}
						zIndex={1000}
						overlayProps={{ radius: "sm", blur: 2 }}
						loaderProps={{ type: "bars" }}
					/>
					{/* ...other content */}
					<form onSubmit={form.onSubmit(handleBuzzSubmit)}>
						<Textarea
							// value={content}
							minRows={10}
							classNames={{
								root: "!rounded-lg !border-[#00000008]",
								input: "!h-[200px] md:!h-[275px] !rounded-lg !border-[#00000008]",
							}}
							placeholder="Say something..."
							// onChange={(event) => setContent(event.currentTarget.value)}
							{...form.getInputProps("content")}
						/>
						<ImageDropZone {...form.getInputProps("attachments")} />
						<Button
							fullWidth
							size="xl"
							// variant="outline"
							type="submit"
							color="rgba(28, 124, 252, 1)"
							classNames={{
								root: cls(
									"!mt-[24px] !border !border-[#0000000d] !rounded-xl !px-3 buttonDisabled"
								),
							}}
							disabled={form.values.content === ""}
						>
							Post
						</Button>
					</form>
				</Box>
			</Modal>
		</>
	);
};

export default BuzzForm;
