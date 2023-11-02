import { Button, Loader, ScrollArea } from "@mantine/core";
// import { buzzlist } from "../mock/buzzList";
import BuzzItem from "./BuzzItem";
import cls from "classnames";
import { isEmpty } from "ramda";
type IProps = {
	buzzList: any;
	onBuzzLike: (hasMyLike: boolean, txid: string) => void;
	isBuzzliking: boolean;
	likeTxid: string;
	loginMetaid: string;
	onLoadMore: () => void;
	isLoadingMore: boolean;
};

const BuzzList = ({
	onLoadMore,
	isLoadingMore,
	buzzList,
	onBuzzLike,
	isBuzzliking,
	likeTxid,
	loginMetaid,
}: IProps) => {
	return (
		<ScrollArea
			offsetScrollbars={false}
			classNames={{ root: "pr-3 mx-3 md:mx-[30%] h-[calc(100vh_-_245px)]" }}
		>
			{/* <button onClick={getBuzzList}>test buzz</button> */}
			<div className="pl-3 border-t border-[rgba(0, 0, 0, 0.03)] flex flex-col space-y-4 py-8">
				{buzzList.map((buzz: any) => {
					// console.log("txid", buzz?.txid);
					return (
						<BuzzItem
							key={buzz.txid}
							txid={buzz.txid}
							likeTxid={likeTxid}
							userName={buzz.user.name}
							content={buzz.body.content}
							likes={buzz.likes}
							metaid={buzz.user.metaid}
							avatarUri={buzz.user.avatar}
							onBuzzLike={(hasMyLike: boolean) => onBuzzLike(hasMyLike, buzz.txid)}
							isBuzzliking={isBuzzliking}
							loginMetaid={loginMetaid}
							createTime={buzz.createdAt}
							attachments={buzz.body.attachments}
						/>
					);
				})}
				{isLoadingMore ? (
					<Loader className="self-center" type="bars" />
				) : (
					<Button
						className={cls("self-center", { "!hidden": isEmpty(buzzList) })}
						onClick={onLoadMore}
					>
						Load More
					</Button>
				)}
			</div>
		</ScrollArea>
	);
};

export default BuzzList;
