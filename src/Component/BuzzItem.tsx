import { Avatar, Box, LoadingOverlay } from "@mantine/core";
import { AiTwotoneHeart, AiOutlineHeart } from "react-icons/ai";
import { PiCopyLight } from "react-icons/pi";
import { parseAvatarWithMetaid, parseAvatarWithUri } from "@/utils/file";
import { LikeItem } from "@/type/buzz";
import dayjs from "dayjs";
import cls from "classnames";
import { parseMetaFile } from "../utils/file";
import { useClipboard } from "@mantine/hooks";
import { ToastContainer, toast } from "react-toastify";
type Iprops = {
	userName: string;
	content: string;
	likes: LikeItem[];
	metaid: string;
	avatarUri: string;
	onBuzzLike: (hasMyLike: boolean) => void;
	isBuzzliking: boolean;
	txid: string;
	likeTxid: string;
	loginMetaid: string;
	createTime: number;
	attachments: string[];
};

const BuzzItem = ({
	userName,
	content,
	likes,
	metaid,
	avatarUri,
	onBuzzLike,
	isBuzzliking,
	txid,
	likeTxid,
	loginMetaid,
	createTime,
	attachments,
}: Iprops) => {
	const hasMyLike = !!likes?.find((d) => d?.metaId == loginMetaid);
	// console.log("has", hasMyLike, loginMetaid);
	const clipboard = useClipboard({ timeout: 500 });
	return (
		<>
			<div
				className="border-b border-[rgba(0, 0, 0, 0.03)] py-4 flex flex-col space-y-2"
				key={txid}
			>
				<div className="flex justify-between">
					<div className="flex space-x-2 items-center">
						<Avatar
							color="blue"
							radius="sm"
							src={
								avatarUri !== ""
									? parseAvatarWithMetaid(metaid)
									: parseAvatarWithUri(avatarUri, metaid)
							}
						>
							{userName.slice(0, 1)}
						</Avatar>
						<div className="flex flex-col">
							<div>{userName}</div>
							<div className="flex space-x-1 items-center">
								<div className="text-[#B3AFB3] text-[8px]" title={metaid}>
									{"MetaID:" + metaid.slice(0, 10) + "..."}
								</div>
								<PiCopyLight
									className="text-[12px] cursor-pointer text-[#B3AFB3]"
									onClick={() => {
										clipboard.copy(metaid);
										toast.success("copy user's metaid to clipboard success!");
									}}
								/>
							</div>
						</div>
					</div>
					<Box pos="relative">
						<LoadingOverlay
							visible={isBuzzliking && txid === likeTxid}
							zIndex={1000}
							overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0 }}
							loaderProps={{ color: "#B3AFB3", size: 14 }}
							classNames={{ loader: "!mb-[22px]", root: "!overflow-visible" }}
						/>

						<div
							className="flex space-x-1.5 items-center"
							onClick={() => {
								console.log("likes", likes);
								onBuzzLike(hasMyLike);
							}}
						>
							{hasMyLike ? (
								<AiTwotoneHeart className={cls(`cursor-pointer text-[#F43A3A]`)} />
							) : (
								<AiOutlineHeart className="cursor-pointer text-[#B3AFB3]" />
							)}
							{likes.length > 0 && (
								<span
									className={cls(
										`cursor-pointer ${
											hasMyLike ? "text-[#F43A3A]" : "text-[#B3AFB3]"
										}`
									)}
								>
									{likes.length}
								</span>
							)}
						</div>
					</Box>
				</div>

				<div className="text-[#303133]">{content} </div>

				{(attachments ?? []).map((d) => {
					// console.log(parseMetaFile(d), "ss");
					return <img key={d} src={parseMetaFile(d)} />;
				})}
				<div className="flex justify-between text-[#909399] items-center text-[10px]">
					<div>{dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
					<div className="flex space-x-1 items-center">
						<PiCopyLight
							className="text-[18px] cursor-pointer"
							onClick={() => {
								clipboard.copy(txid);
								toast.success("copy txid to clipboard success!");
							}}
						/>
						<div
							className="cursor-pointer"
							title={"click to check txid's detail on MVCSCAN"}
							onClick={() => {
								window.open("https://www.mvcscan.com/tx/" + txid);
							}}
						>
							{"TX: " + txid.slice(0, 6) + "..."}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BuzzItem;
