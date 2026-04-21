import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Before the site-wide falconry pivot, content lived under
    // /[locale]/animals/falcons/<section>. All existing Vercel and
    // social links should keep working — redirect them to the new
    // /[locale]/guide/<section> structure permanently.
    return [
      {
        source: "/:locale(ar|en)/animals",
        destination: "/:locale/guide",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/animals/falcons",
        destination: "/:locale/guide",
        permanent: true,
      },
      {
        source: "/:locale(ar|en)/animals/falcons/:section",
        destination: "/:locale/guide/:section",
        permanent: true,
      },
      // Anyone who ever shared a non-falcon animal URL (we never wrote
      // content for them, but the route existed) lands gracefully on
      // the guide index.
      {
        source: "/:locale(ar|en)/animals/:slug*",
        destination: "/:locale/guide",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
