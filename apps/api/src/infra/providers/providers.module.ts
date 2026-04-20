import { Module } from "@nestjs/common";
import { HashProvider } from "./hash/hash.provider";
import { HashProviderProps } from "./hash/types/hash-provider.props";

@Module({
	providers: [
		{
			provide: HashProviderProps,
			useClass: HashProvider,
		},
	],
	exports: [HashProviderProps],
})
export class ProvidersModule {}
