import { FakeEmailProvider, FakeMailProvider } from "./fake-email.provider";
import { MailProvider } from "./mail.provider";

export const MailProviderOptions = {
	development: FakeMailProvider,
	production: MailProvider,
	test: FakeEmailProvider,
};
