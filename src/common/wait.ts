
export async function wait(timeout: number = 0) {
	await (new Promise((resolve) => setTimeout(() => resolve(true), timeout)));
}
