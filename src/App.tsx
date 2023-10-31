/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import BuzzForm from "./Component/BuzzForm";
import BuzzList from "./Component/BuzzList";
import Nav from "./Component/Nav";
import { LocalWallet, MetaletWallet, connect } from "@metaid/metaid";
import { Box, LoadingOverlay } from "@mantine/core";
import { ToastContainer, toast } from "react-toastify";
import { divide, isEmpty, isNil } from "ramda";
import { produce } from "immer";
import "./App.css";
import { AttachmentItem } from "./utils/file";

function App() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars

	const [Buzz, setBuzz] = useState(null);
	const [baseConnector, setBaseConnector] = useState<any>();
	const [hasLogin, setHasLogin] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const [buzzList, setBuzzList] = useState([]);
	const [isBuzzPosting, setIsBuzzPosting] = useState(false);
	const [isBuzzliking, setIsBuzzliking] = useState(false);
	const [isCreateMetaid, setIsCreateMetaid] = useState(false);
	const [likeTxid, setLikeTxid] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	// const [totalPage, setTotalPage] = useState(1);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	useEffect(() => {
		getBuzzList({ page: 1, isNew: true });
	}, []);

	const handleLogin = async (type: "metalet" | "local", memonicValue?: string, path?: string) => {
		setIsLogin(true);

		let _wallet = null;
		try {
			if (type === "metalet") {
				_wallet = await MetaletWallet.create();
			} else {
				_wallet = await LocalWallet.create(memonicValue, `m/44'/${path}'/0'/0/0`);
			}
		} catch (error) {
			console.log("error", error);
			toast.warn((error as { message: string; stack: string })?.message ?? "");
			setIsLogin(false);
			setHasLogin(false);
			return;
		}
		try {
			const baseConnector = await connect(_wallet);
			setBaseConnector(baseConnector);
			// if (!baseConnector.user) {
			// 	toast.warn("connect canceled");
			// 	return;
			// }
			console.log("base connector", baseConnector);

			const handler = await baseConnector.use("buzz");

			setBuzz(handler);

			// const { items } = await handler.list(currentPage);
			// setBuzzList(items);
			// setCurrentPage(currentPage + 1);
			setHasLogin(true);
			setIsLogin(false);
			return;
		} catch (error) {
			setIsLogin(false);
			setHasLogin(false);

			toast.warn("connect error");
			return;
		}
	};
	// console.log("islogin", isLogin, currentPage);
	const handleLoginFinish = () => {
		setIsLogin(false);
	};

	const handleCreateMetaid = async (userName: string) => {
		console.log({ baseConnector });
		setIsCreateMetaid(true);
		if (!!baseConnector && !baseConnector.isMetaidValid()) {
			try {
				await baseConnector.createMetaid({ name: userName });
			} catch (error) {
				console.log("error", error);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				toast.warn("Error:" + (error as any).message);
				setIsCreateMetaid(false);
			}

			setIsCreateMetaid(false);
		}
	};

	const handleLogout = async () => {
		setHasLogin(false);
		setBaseConnector(null);
		// baseConnector.disconnect();
		await getBuzzList({ page: 1, isNew: true });
		// setBuzzList([]);
		// setCurrentPage(1);
		setIsBuzzPosting(false);
		setIsBuzzliking(false);
	};

	const getBuzzList = async ({ page, isNew = false }: { page?: number; isNew?: boolean }) => {
		let handler;
		if (isNil(baseConnector)) {
			handler = await (await connect()).use("buzz");
		} else {
			handler = await baseConnector.use("buzz");
		}

		if (isNew) {
			const { items } = await handler.list(1);
			setBuzzList(items);
			setCurrentPage(1);
			return;
		}
		// @ts-ignore
		const { items } = await handler.list(page);
		console.log(items);
		// setBuzzList(items as any);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		setBuzzList([...buzzList, ...items] as any);
	};

	const handlePost = async (content: string, attachments?: AttachmentItem[]) => {
		setIsBuzzPosting(true);
		try {
			let body: any = { content };
			if (!isNil(attachments) && !isEmpty(attachments)) {
				let attachMetafileUri = [];
				console.log("file", "start");
				const fileHandler = await baseConnector.use("file");
				for (const a of attachments) {
					console.log("a.data", a.data);
					const data = Buffer.from(a.data, "hex");
					const { txid: id } = await fileHandler.create(data, { dataType: a.fileType });
					attachMetafileUri.push("metafile://" + id);
				}
				body.attachments = attachMetafileUri;
			}

			// @ts-ignore
			const { txid } = await Buzz.create(body);

			setTimeout(async () => {
				await getBuzzList({ isNew: true });
				setIsBuzzPosting(false);
				toast.success("Fantastic my old baby! You have successly send a buzz!");
			}, 2000);
		} catch (error) {
			toast.warn("create error");
			console.log("error", error);
			setIsBuzzPosting(false);
		}
	};

	const onBuzzLike = async (hasMyLike: boolean, txid: string) => {
		if (isNil(baseConnector)) {
			toast.warn("Please login to give a like!");
			return;
		}

		if (!!baseConnector && !baseConnector.isMetaidValid()) {
			setIsBuzzliking(false);
			toast.warn("Please create your metaid account first!");
			return;
		}
		if (hasMyLike) {
			setIsBuzzliking(false);
			toast.warn("You have already liked that buzz!");
			return;
		}
		setLikeTxid(txid);
		setIsBuzzliking(true);

		// @ts-ignore
		// console.log("baseconnect", baseConnector, hasMyLike, txid);
		const likeHandler = await baseConnector.use("like");
		try {
			// console.log("begin");
			const res = await likeHandler.create({ likeTo: txid, isLike: "1" });
			// console.log("res", res);
			setTimeout(async () => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const idx = buzzList.findIndex((d: any) => d.txid === txid) + 1;
				const findPage = Math.ceil(divide(idx, 15));

				const handler = await baseConnector.use("buzz");
				const { items: updateItems } = await handler.list(findPage);
				console.log(idx, findPage, updateItems);
				setBuzzList(
					produce((d) => {
						// @ts-ignore
						d.splice((findPage - 1) * 15, 15, ...updateItems);
						return d;
					})
				);

				// await getBuzzList({ page: currentPage });
				setIsBuzzliking(false);
				toast.success("Buzz like Success! Thank you my old baby! ");
			}, 2000);
		} catch (error) {
			// console.log("error", error);
			setIsBuzzliking(false);

			// @ts-ignore
			toast.warn((error as any).message);
		}
	};
	const onLoadMore = async () => {
		setIsLoadingMore(true);
		await getBuzzList({ page: currentPage + 1 });
		setIsLoadingMore(false);
		setCurrentPage(currentPage + 1);
	};
	return (
		<Box pos="relative">
			<LoadingOverlay
				visible={isLogin}
				zIndex={1000}
				overlayProps={{ radius: "sm", blur: 2 }}
				loaderProps={{ type: "bars" }}
			/>
			<div className=" ">
				<Nav
					hasLogin={hasLogin}
					handleLogin={handleLogin}
					onLogout={handleLogout}
					accountData={baseConnector?.user}
					onLoginFinish={handleLoginFinish}
					onCreateMetaid={handleCreateMetaid}
					isCreateMetaid={isCreateMetaid}
				/>
				<BuzzForm
					handlePost={handlePost}
					isBuzzPosting={isBuzzPosting}
					baseConnector={baseConnector}
				/>
				{/* {!hasLogin ? (
					<Center className="x-3 md:mx-[30%] h-[calc(100vh_-_345px)]">
						<Box className="text-[#B3AFB3] text-[20px]">
							Please login to get the buzz list.
						</Box>
					</Center>
				) : ( */}
				<BuzzList
					buzzList={buzzList}
					onBuzzLike={onBuzzLike}
					isBuzzliking={isBuzzliking}
					likeTxid={likeTxid}
					currentMetaid={baseConnector?.metaid}
					onLoadMore={onLoadMore}
					isLoadingMore={isLoadingMore}
				/>
				{/* )} */}
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
		</Box>
	);
}

export default App;
