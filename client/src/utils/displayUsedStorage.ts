const KB = 1;
const MB = KB * 1000;
const GB = MB * 1000;
const TB = GB * 1000;

export const displayStorage = (storage: number) => {
	if (storage < MB) return `${Math.ceil(storage)}KB`;
	if (storage < GB) return `${Math.ceil(storage / MB)}MB`;
	if (storage < TB) return `${Math.ceil((storage * 100) / GB) / 100}GB`;
	return `${Math.ceil((storage * 100) / TB) / 100}TB`;
};
