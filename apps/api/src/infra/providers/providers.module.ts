import { Module } from "@nestjs/common";
import { LogEmailProvider } from "./email/log-email.provider";
import { EmailProviderProps } from "./email/types/email-provider.props";
import { HashProvider } from "./hash/hash.provider";
import { HashProviderProps } from "./hash/types/hash-provider.props";

@Module({
	providers: [
		{
			provide: HashProviderProps,
			useClass: HashProvider,
		},
		{
			provide: EmailProviderProps,
			useClass: LogEmailProvider,
		},
	],
	exports: [HashProviderProps, EmailProviderProps],
})
export class ProvidersModule {}
