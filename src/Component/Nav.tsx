import { Avatar, Box, Button, Collapse, Modal, Popover, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RiWalletFill } from "react-icons/ri";
import MetaletLogo from "@/assets/metalet.png";
import { BsArrowRightShort } from "react-icons/bs";
import { useState } from "react";
import { parseAvatarWithMetaid, parseAvatarWithUri } from "@/utils/file";
import { isNil } from "ramda";
type IProps = {
	handleLogin: (type: "local" | "metalet", memonicValue?: string, path?: string) => void;
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
	const [memonicValue, setMemonicValue] = useState("");
	const [path, setPath] = useState("10001");
	const handleMemonicChange = (v: string) => {
		setMemonicValue(v);
	};
	const handlePathChange = (v: string) => {
		setPath(v);
	};

	const onLoginEndEffect = () => {
		showConnectHandler.close();
		memonicHandler.close();
		setMemonicValue("");
	};
	console.log("haslogin", hasLogin, accountData);
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
									<Avatar
										color="blue"
										size={30}
										radius="xl"
										src={
											accountData?.avatar !== ""
												? parseAvatarWithMetaid(accountData?.metaid)
												: parseAvatarWithUri(
														accountData?.avatarUri,
														accountData?.metaid
												  )
										}
									>
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
									Logout
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
				<div className="md:block hidden">
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
							onLoginEndEffect();
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
				</div>
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
							classNames={{ input: "!h-[120px]" }}
							placeholder="Please enter your memonic words"
							size="lg"
							value={memonicValue}
							onChange={(e) => handleMemonicChange(e.currentTarget.value)}
						/>
						<TextInput
							className="!mt-1"
							placeholder="Please enter your path"
							size="lg"
							value={path}
							onChange={(e) => handlePathChange(e.currentTarget.value)}
						/>
						<div className="mt-1 text-slate-500">{`Path：m/44'/${path}'/0'`}</div>
						<Button
							variant="light"
							size="lg"
							className="!mt-1"
							disabled={memonicValue === ""}
							onClick={async () => {
								onLoginEndEffect();
								await handleLogin("local", memonicValue, path);
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
