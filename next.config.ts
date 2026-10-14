import type { NextConfig } from "next";
import { getRuntimeMode } from "./src/local/server/getRuntimeMode";

getRuntimeMode();

const nextConfig: NextConfig = {};

export default nextConfig;
