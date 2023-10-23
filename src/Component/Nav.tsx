import { Avatar, Box, Button, Collapse, Modal, Popover, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RiWalletFill } from "react-icons/ri";
import MetaletLogo from "@/assets/metalet.png";
import { BsArrowRightShort } from "react-icons/bs";
import { useState } from "react";

type IProps = {
	handleLogin: (type: "local" | "metalet", memonicValue?: string) => void;
	hasLogin: boolean;
	accountData: any;
	onLogout: () => void;
	onLoginFinish: () => void;
	onCreateMetaid: () => void;
	isCreateMetaid: boolean;
};

const Nav = ({
	handleLogin,
	hasLogin,
	accountData,
	onLogout,
	onLoginFinish,
	onCreateMetaid,
	isCreateMetaid,
}: IProps) => {
	const [showConnect, showConnectHandler] = useDisclosure(false);
	const [opened, setOpened] = useState(false);
	const [showMemonic, memonicHandler] = useDisclosure(false);
	const [memonicValue, setMemonicValue] = useState(
		"vacant cheap figure menu damp gorilla antique hat hero afford egg magnet"
	);
	const handleMemonicChange = (v: string) => {
		setMemonicValue(v);
	};
	return (
		<>
			<div className=" h-[60px] md:px-[30%] px-3 flex justify-end py-3 shadow-xl shadow-[#c6dfea]">
				{!hasLogin ? (
					<Button
						variant="transparent"
						color="#303133"
						leftSection={<RiWalletFill size={14} />}
						onClick={showConnectHandler.open}
					>
						Connect Wallet
					</Button>
				) : (
					<div className="flex space-x-2 items-center">
						<Popover opened={opened} onChange={setOpened}>
							<Popover.Target>
								<div
									className="flex space-x-1.5 items-center cursor-pointer"
									onClick={() => setOpened((o) => !o)}
								>
									<Avatar color="blue" size={30} radius="xl" src={null}>
										{accountData?.name?.slice(0, 1)}
									</Avatar>
									<div className="text-slate-800">
										{accountData?.name ?? "No MetaId Detected"}
									</div>
								</div>
							</Popover.Target>
							<Popover.Dropdown className="!p-0">
								<Button
									variant="subtle"
									classNames={{ root: "!w-[120px]" }}
									onClick={() => {
										onLogout();
										setOpened(false);
									}}
								>
									登出
								</Button>
							</Popover.Dropdown>
						</Popover>
						{!accountData && (
							<Button
								loading={isCreateMetaid}
								variant="subtle"
								onClick={onCreateMetaid}
							>
								Create MetaIdUser
							</Button>
						)}
					</div>
				)}
			</div>

			<Modal
				centered
				withCloseButton={false}
				opened={showConnect}
				onClose={showConnectHandler.close}
				title="Connect Wallet"
				classNames={{
					content: "!rounded-xl",
					body: "!p-[30px]",
					header: "!py-[30px] !mx-[30px] !border-b !border-[#00000008] !flex !justify-center",
					title: "!text-[24px]",
					inner: "!px-[60px]",
				}}
			>
				<Button
					fullWidth
					size="xl"
					variant="outline"
					color="#303133"
					classNames={{
						root: "!border !border-[#0000000d] !rounded-xl !px-3",
						label: "!w-full !flex !justify-between",
					}}
					onClick={async () => {
						// handleMetaletConnect();
						showConnectHandler.close();
						memonicHandler.close();
						await handleLogin("metalet");
						onLoginFinish();
					}}
				>
					<div className="flex space-x-2 items-center">
						<img src={MetaletLogo} className="w-[30px] height-[30px]" />
						<div>Metalet</div>
					</div>
					<BsArrowRightShort />
				</Button>
				<Box>
					<Button
						fullWidth
						size="xl"
						variant="outline"
						color="#303133"
						classNames={{
							root: "!mt-4 !border !border-[#0000000d] !rounded-xl !px-3",
							label: "!w-full !flex !justify-between",
						}}
						onClick={memonicHandler.toggle}
					>
						<div className="flex space-x-2 items-center">
							<div>Local Wallet</div>
						</div>
						<BsArrowRightShort />
					</Button>
					<Collapse in={showMemonic}>
						<Textarea
							classNames={{ input: "!h-[200px]" }}
							placeholder="Please enter your memonic words"
							size="lg"
							value={memonicValue}
							onChange={(e) => handleMemonicChange(e.currentTarget.value)}
						/>
						<Button
							variant="light"
							size="lg"
							className="!mt-1"
							onClick={async () => {
								// handleWalletConnect();
								showConnectHandler.close();
								memonicHandler.close();
								await handleLogin("local", memonicValue);
								onLoginFinish();
							}}
							fullWidth
						>
							Continue
						</Button>
					</Collapse>
				</Box>
			</Modal>
		</>
	);
};

export default Nav;
