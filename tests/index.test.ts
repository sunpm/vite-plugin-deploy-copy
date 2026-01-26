import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import deployCopy from '../src/index';
import path from 'node:path';
import fs from 'node:fs';

const fixturesDir = path.resolve(__dirname, 'fixtures');
const srcDir = path.join(fixturesDir, 'src');
const destDir = path.join(fixturesDir, 'dest');

async function runPlugin(options: any) {
    const plugin = deployCopy(options);
    // @ts-ignore
    if (typeof plugin.closeBundle === 'function') {
        // @ts-ignore
        await plugin.closeBundle();
    }
}

describe('vite-plugin-deploy-copy', () => {
    beforeEach(() => {
        // Clean up fixtures
        if (fs.existsSync(fixturesDir)) {
            fs.rmSync(fixturesDir, { recursive: true, force: true });
        }

        // Setup src directory with a file
        fs.mkdirSync(srcDir, { recursive: true });
        fs.writeFileSync(path.join(srcDir, 'test.txt'), 'hello world');
        fs.writeFileSync(path.join(srcDir, 'nested.json'), '{}');
    });

    afterEach(() => {
        // Cleanup
        if (fs.existsSync(fixturesDir)) {
            fs.rmSync(fixturesDir, { recursive: true, force: true });
        }
        vi.restoreAllMocks();
    });

    it('should copy files from src to dest', async () => {
        await runPlugin({
            targets: [{ src: srcDir, dest: destDir }]
        });

        expect(fs.existsSync(path.join(destDir, 'test.txt'))).toBe(true);
        expect(fs.existsSync(path.join(destDir, 'nested.json'))).toBe(true);
    });

    it('should create destination directory if it does not exist', async () => {
        const newDest = path.join(fixturesDir, 'new-dest');
        await runPlugin({
            targets: [{ src: srcDir, dest: newDest }]
        });

        expect(fs.existsSync(newDest)).toBe(true);
        expect(fs.existsSync(path.join(newDest, 'test.txt'))).toBe(true);
    });

    it('should clean destination directory by default', async () => {
        // Create dest and add a file that should be removed
        fs.mkdirSync(destDir, { recursive: true });
        fs.writeFileSync(path.join(destDir, 'old.txt'), 'old file');

        await runPlugin({
            targets: [{ src: srcDir, dest: destDir }]
        });

        expect(fs.existsSync(path.join(destDir, 'old.txt'))).toBe(false);
        expect(fs.existsSync(path.join(destDir, 'test.txt'))).toBe(true);
    });

    it('should preserve specified files', async () => {
        // Create dest and add a file that should be preserved
        fs.mkdirSync(destDir, { recursive: true });
        fs.writeFileSync(path.join(destDir, 'keep-me.txt'), 'keep me');
        fs.writeFileSync(path.join(destDir, 'delete-me.txt'), 'delete me');

        await runPlugin({
            targets: [{
                src: srcDir,
                dest: destDir,
                preserve: ['keep-me.txt']
            }]
        });

        expect(fs.existsSync(path.join(destDir, 'keep-me.txt'))).toBe(true);
        expect(fs.existsSync(path.join(destDir, 'delete-me.txt'))).toBe(false);
        expect(fs.existsSync(path.join(destDir, 'test.txt'))).toBe(true);
    });

    it('should handle non-existent source directory gracefully', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const missingSrc = path.join(fixturesDir, 'missing');

        await runPlugin({
            targets: [{ src: missingSrc, dest: destDir }]
        });

        expect(spy).toHaveBeenCalled();
        expect(fs.existsSync(destDir)).toBe(false);
    });

    it('should handle multiple targets in parallel', async () => {
        const dest1 = path.join(fixturesDir, 'dest1');
        const dest2 = path.join(fixturesDir, 'dest2');

        await runPlugin({
            targets: [
                { src: srcDir, dest: dest1 },
                { src: srcDir, dest: dest2 }
            ]
        });

        expect(fs.existsSync(path.join(dest1, 'test.txt'))).toBe(true);
        expect(fs.existsSync(path.join(dest2, 'test.txt'))).toBe(true);
    });
});
