import { Module } from "@nestjs/common";
import { env } from "src/env";
import { MailProviderOptions } from "./email/constants";
import { GenerateMailTemplateFromHTMLService } from "./email/generate-template-from-html";

import { MailProviderProps } from "./email/types/mail-provider.props";
import { HashProvider } from "./hash/hash.provider";
import { HashProviderProps } from "./hash/types/hash-provider.props";

@Module({
	providers: [
		GenerateMailTemplateFromHTMLService,
		{
			provide: HashProviderProps,
			useClass: HashProvider,
		},
		{
			provide: MailProviderProps,
			useClass: MailProviderOptions[env.NODE_ENV],
		},
		{
			provide: MailProviderProps,
			useClass: MailProviderOptions[env.NODE_ENV],
		},
	],
	exports: [HashProviderProps, MailProviderProps, MailProviderProps],
})
export class ProvidersModule {}
