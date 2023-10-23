import { Box, Button, LoadingOverlay, Modal, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import cls from "classnames";

import buzzLogo from "@/assets/buzzhub-logo.png";
import "./style.css";

type IProps = {
	handlePost: (content: string) => void;
	isBuzzPosting: boolean;
};

const BuzzForm = ({ handlePost, isBuzzPosting }: IProps) => {
	const [showCreate, showCreateHandler] = useDisclosure(false);

	const form = useForm({
		initialValues: {
			content: "",
		},
	});
	// console.log("isbuzz creating", isBuzzPosting);
	return (
		<>
			<div className="flex md:mx-[30%] mx-3 space-x-2 py-8 border-b border-[#CEE0E8]">
				<img src={buzzLogo} alt="buzzlogo" className="w-[30px] h-[30px]" />
				<div className="flex-1">
					<div>
						<div className="title">BuzzHub</div>
						<div className="desc">Join the Buzz and stay in the loop.</div>
					</div>
					<TextInput
						classNames={{ root: "mt-5", input: "border-0" }}
						size="lg"
						radius="md"
						placeholder="Say Something..."
						onClick={showCreateHandler.open}
					/>
				</div>
			</div>
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
					<form
						onSubmit={form.onSubmit(async (values) => {
							await handlePost(values.content);

							console.log(values);
							form.setValues({ content: "" });
							if (!isBuzzPosting) {
								showCreateHandler.close();
							}
						})}
					>
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
