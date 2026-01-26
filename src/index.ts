import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import type { Plugin } from 'vite';
import pc from 'picocolors';

export interface Target {
    /**
     * Source path (relative or absolute)
     */
    src: string;
    /**
     * Destination path (relative or absolute)
     */
    dest: string;
    /**
     * Files to preserve in the destination directory.
     * These files will not be deleted during the cleanup phase.
     */
    preserve?: string[];
}

export interface PluginOptions {
    /**
     * Array of copy targets
     */
    targets: Target[];
}

/**
 * Custom plugin to copy build output to specific destinations
 */
export default function deployCopy(options: PluginOptions): Plugin {
    return {
        name: 'vite-plugin-deploy-copy',
        apply: 'build',
        async closeBundle() {
            const targets = options.targets || [];

            if (!targets.length) return;

            await Promise.all(targets.map(async (target) => {
                const { src, dest, preserve = [] } = target;
                const cwd = process.cwd();

                const srcPath = path.isAbsolute(src) ? src : path.resolve(cwd, src);
                const destPath = path.isAbsolute(dest) ? dest : path.resolve(cwd, dest);
                const preserveSet = new Set(preserve);

                try {
                    if (!existsSync(srcPath)) {
                        console.warn(pc.yellow(`[deploy-copy] Source directory `) + pc.bold(srcPath) + pc.yellow(` does not exist. Skipping.`));
                        return;
                    }

                    // Ensure destination exists
                    if (!existsSync(destPath)) {
                        await fs.mkdir(destPath, { recursive: true });
                    }

                    console.log(pc.cyan(`[deploy-copy] Copying from `) + pc.bold(srcPath) + pc.cyan(` to `) + pc.bold(destPath) + pc.cyan(`...`));

                    // Clean destination (safely)
                    const items = await fs.readdir(destPath);
                    await Promise.all(items.map(async (item) => {
                        if (preserveSet.has(item)) return;
                        const itemPath = path.join(destPath, item);
                        await fs.rm(itemPath, { recursive: true, force: true });
                    }));

                    // Copy files
                    await fs.cp(srcPath, destPath, { recursive: true, force: true });
                    console.log(pc.green(`[deploy-copy] Success: `) + pc.bold(srcPath) + pc.green(` -> `) + pc.bold(destPath));
                } catch (error) {
                    console.error(pc.red(`[deploy-copy] Error processing `) + pc.bold(destPath));
                    console.error(error);
                }
            }));
        },
    };
}
