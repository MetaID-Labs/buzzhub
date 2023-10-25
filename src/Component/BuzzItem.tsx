import { Avatar, Box, LoadingOverlay } from "@mantine/core";
import { AiTwotoneHeart, AiOutlineHeart } from "react-icons/ai";

import { parseAvatarWithMetaid, parseAvatarWithUri } from "@/utils/file";
import { LikeItem } from "@/type/buzz";
import dayjs from "dayjs";
import cls from "classnames";
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
	currentMetaid: string;
	createTime: number;
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
	currentMetaid,
	createTime,
}: Iprops) => {
	const hasMyLike = !!likes?.find((d) => d?.metaId == currentMetaid);
	// console.log("has", hasMyLike, currentMetaid);
	return (
		<div className="border-b border-[rgba(0, 0, 0, 0.03)] py-4 flex flex-col space-y-2">
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
					<div>{userName}</div>
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

			<div className="flex justify-between text-[#909399] items-center text-[10px]">
				<div>{dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
				<div className="cursor-pointer" title={txid}>
					{"TX: " + txid.slice(0, 6) + "..."}
				</div>
			</div>
		</div>
	);
};

export default BuzzItem;
