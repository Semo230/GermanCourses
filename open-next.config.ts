import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every page reads the signed-in user, so nothing is cached between requests
// and no R2 bucket is needed.
export default defineCloudflareConfig({});
