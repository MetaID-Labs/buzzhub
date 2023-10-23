/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import BuzzForm from "./Component/BuzzForm";
import BuzzList from "./Component/BuzzList";
import Nav from "./Component/Nav";
import { LocalWallet, MetaletWallet, connect } from "@metaid/metaid";
import { Box, LoadingOverlay, Center } from "@mantine/core";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";

function App() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [path, _] = useState(`m/44'/10001'/0'/0/0`);
	const [Buzz, setBuzz] = useState(null);
	const [baseConnector, setBaseConnector] = useState<any>(null);
	const [hasLogin, setHasLogin] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const [buzzList, setBuzzList] = useState([]);
	const [isBuzzPosting, setIsBuzzPosting] = useState(false);
	const [isBuzzliking, setIsBuzzliking] = useState(false);
	const [isCreateMetaid, setIsCreateMetaid] = useState(false);
	const [likeTxid, setLikeTxid] = useState("");
	const handleLogin = async (type: "metalet" | "local", memonicValue?: string) => {
		setIsLogin(true);
		let _wallet = null;
		if (type === "metalet") {
			_wallet = await MetaletWallet.create();
		} else {
			_wallet = await LocalWallet.create(memonicValue, path);
		}
		const baseConnector = await connect(_wallet);
		setBaseConnector(baseConnector);

		const handler = await baseConnector.use("buzz");

		setBuzz(handler);
		setHasLogin(true);
		console.log(Buzz);

		const { items } = await handler.list();
		setBuzzList(items);
	};
	const handleLoginFinish = () => {
		setIsLogin(false);
	};

	const handleCreateMetaid = async () => {
		console.log({ baseConnector });
		setIsCreateMetaid(true);
		if (!!baseConnector && !baseConnector.isMetaidValid()) {
			const res = await baseConnector.createMetaid();
			console.log({ res });
			setIsCreateMetaid(false);
		}
	};

	const handleLogout = () => {
		baseConnector.disconnect();
		setHasLogin(false);
		setBuzzList([]);
	};

	const getBuzzList = async () => {
		// @ts-ignore
		const { items } = await Buzz.list();
		console.log({ items });
		setBuzzList(items);
	};

	const handlePost = async (content: string) => {
		setIsBuzzPosting(true);
		// @ts-ignore
		await Buzz.create({ content });

		setTimeout(async () => {
			// const { items } = await Buzz.list();
			// console.log("after post", { items });
			// setBuzzList(items);
			await getBuzzList();
			setIsBuzzPosting(false);
			toast.success("Fantastic my old baby! You have successly send a buzz!");
		}, 1000);
	};
	console.log("out", buzzList);

	const onBuzzLike = async (hasMyLike: boolean, txid: string) => {
		if (hasMyLike) {
			toast.warn("You have already liked that buzz!");
			return;
		}
		setLikeTxid(txid);
		setIsBuzzliking(true);
		// @ts-ignore
		const likeHandler = await baseConnector.use("like");
		// @ts-ignore
		console.log("hasmylike", hasMyLike);
		await likeHandler.create({ likeTo: txid, isLike: "1" });

		setTimeout(async () => {
			await getBuzzList();
			setIsBuzzliking(false);
		}, 2000);
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
				<BuzzForm handlePost={handlePost} isBuzzPosting={isBuzzPosting} />
				{!hasLogin ? (
					<Center className="x-3 md:mx-[30%] h-[calc(100vh_-_345px)]">
						<Box className="text-[#B3AFB3] text-[20px]">
							Please login to get the buzz list.
						</Box>
					</Center>
				) : (
					<BuzzList
						buzzList={buzzList}
						onBuzzLike={onBuzzLike}
						isBuzzliking={isBuzzliking}
						likeTxid={likeTxid}
						currentMetaid={baseConnector?.user?.metaId}
					/>
				)}
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
