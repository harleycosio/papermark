import { z } from "zod";

export const envSchema = z.object({
  SLACK_APP_INSTALL_URL: z.string(),
  SLACK_CLIENT_ID: z.string(),
  SLACK_CLIENT_SECRET: z.string(),
  SLACK_INTEGRATION_ID: z.string(),
});

type SlackEnv = z.infer<typeof envSchema>;

let env: SlackEnv | undefined;

export const getSlackEnv = () => {
  if (env) {
    return env;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    if (process.env.NODE_ENV === "production" && !process.env.CI) {
      console.warn(
        "Slack app environment variables are not configured properly. Slack features will be disabled.",
      );
    }
    return {
      SLACK_APP_INSTALL_URL: "",
      SLACK_CLIENT_ID: "",
      SLACK_CLIENT_SECRET: "",
      SLACK_INTEGRATION_ID: "slack",
    } as SlackEnv;
  }

  env = parsed.data;

  return env;
};
