export function parseMetaFile(metaFileUri: string): string {
	// remove prefix: metafile://, then replace .jpeg with .jpg
	const METAFILE_API_HOST = "https://filecdn.showpay.top";
	const metaFile = metaFileUri.split("metafile://")[1].replace(".jpeg", ".jpg");
	// if there is no extension name in metaFile, add .png
	if (!metaFile.includes(".")) {
		return `${METAFILE_API_HOST}/metaFile/original/${metaFile}.png`;
	}

	return `${METAFILE_API_HOST}/metaFile/original/${metaFile}`;
}

export function parseAvatarWithMetaid(metaid: string): string {
	const METAFILE_API_HOST = "https://api.show3.io/metafile";

	return `${METAFILE_API_HOST}/avatar/compress/${metaid}`;
}
export function parseAvatarWithUri(originUri: string, txid: string) {
	const METAFILE_API_HOST = "https://api.show3.io/metafile";
	if (originUri.includes("metafile")) {
		return `${METAFILE_API_HOST}/compress/${txid}`;
	}
	if (originUri.includes("sensibile")) {
		return `${METAFILE_API_HOST}/sensible/${originUri.split("sensibile://")[1]}`;
	}
	if (originUri.includes("metacontract")) {
		return `${METAFILE_API_HOST}/metacontract/${originUri.split("metacontract://")[1]}`;
	}
}

// https://api.show3.io/metafile/sensible/0d0fc08db6e27dc0263b594d6b203f55fb5282e2/204dafb6ee543796b4da6f1d4134c1df2609bdf1/6
// https://api.show3.io/metafile/avatar/compress/2df27132058cd24ff9ef2939315c9ca0d8ec88733f5bda0df130b7798efea972
