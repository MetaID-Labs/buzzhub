import { Avatar, Box, LoadingOverlay } from "@mantine/core";
import { AiTwotoneHeart, AiOutlineHeart } from "react-icons/ai";

import { parseAvatarWithMetaid, parseAvatarWithUri } from "@/utils/file";
import { LikeItem } from "@/type/buzz";

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
}: Iprops) => {
	return (
		<div className="border-b border-[rgba(0, 0, 0, 0.03)] py-4">
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
					{likes.length > 0 ? (
						<div className="flex space-x-1.5 items-center">
							<AiTwotoneHeart
								onClick={() =>
									onBuzzLike(!!likes?.find((d) => d?.metaId == currentMetaid))
								}
								className="cursor-pointer text-[#F43A3A]"
							/>
							{likes.length > 1 && (
								<span className="cursor-pointer text-[#F43A3A]">
									{likes.length}
								</span>
							)}
						</div>
					) : (
						<AiOutlineHeart
							onClick={() =>
								onBuzzLike(!!likes?.find((d) => d?.metaId == currentMetaid))
							}
							className="cursor-pointer text-[#B3AFB3]"
						/>
					)}
				</Box>
			</div>

			<div className="text-[#303133]">{content} </div>
		</div>
	);
};

export default BuzzItem;
