export abstract class HashProviderProps {
	abstract hash(password: string): Promise<string>;

	abstract compare(
		password: string,
		password_compared: string,
	): Promise<boolean>;
}
