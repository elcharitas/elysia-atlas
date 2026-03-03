import { t } from "elysia";
import type { BaseApp } from "../../base";

export default (app: BaseApp) =>
	app.post(
		"",
		({ body }) => {
			if (body.otp === "123456") {
				return { verified: true, email: body.email };
			}
			return { verified: false, error: "Invalid OTP" };
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				otp: t.String({ minLength: 4 }),
			}),
			detail: {
				tags: ["Auth"],
				description: "Verify email with OTP code",
			},
		},
	);
