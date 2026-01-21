import fs from 'node:fs';
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
        closeBundle() {
            const targets = options.targets || [];

            targets.forEach((target) => {
                const { src, dest, preserve = [] } = target;

                const cwd = process.cwd();

                const srcPath = path.isAbsolute(src) ? src : path.resolve(cwd, src);
                const destPath = path.isAbsolute(dest) ? dest : path.resolve(cwd, dest);

                if (!fs.existsSync(srcPath)) {
                    console.warn(pc.yellow(`[deploy-copy] Source directory ${srcPath} does not exist. Skipping.`));
                    return;
                }

                // Ensure destination exists
                if (!fs.existsSync(destPath)) {
                    console.log(pc.dim(`[deploy-copy] Destination ${destPath} does not exist. Creating...`));
                    fs.mkdirSync(destPath, { recursive: true });
                }

                console.log(pc.cyan(`[deploy-copy] Copying from ${srcPath} to ${destPath}...`));

                // Clean destination (safely)
                if (fs.existsSync(destPath)) {
                    const items = fs.readdirSync(destPath);
                    for (const item of items) {
                        if (preserve.includes(item)) {
                            continue;
                        }
                        const itemPath = path.join(destPath, item);
                        fs.rmSync(itemPath, { recursive: true, force: true });
                    }
                }

                // Copy files
                fs.cpSync(srcPath, destPath, { recursive: true });
                console.log(pc.green(`[deploy-copy] Success: ${srcPath} -> ${destPath}`));
            });
        },
    };
}
