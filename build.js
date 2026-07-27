import { build as buildVite } from "vite";
import { build as buildEsbuild } from "esbuild";

async function runBuild() {
  console.log("Building Vite client...");
  await buildVite();

  console.log("Building server/_core/index.ts...");
  await buildEsbuild({
    entryPoints: ["server/_core/index.ts"],
    platform: "node",
    packages: "external",
    bundle: true,
    format: "esm",
    outdir: "dist",
  });

  console.log("Building api/index.ts...");
  await buildEsbuild({
    entryPoints: ["api/index.ts"],
    platform: "node",
    packages: "external",
    bundle: true,
    format: "esm",
    outfile: "api/index.js",
  });

  console.log("Build completed successfully!");
}

runBuild().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
