import { defineConfig } from 'vite';
import deployCopy from 'vite-plugin-deploy-copy';
import path from 'path';

export default defineConfig({
    plugins: [
        deployCopy({
            targets: [
                {
                    src: 'dist',
                    dest: 'deploy-result',
                    preserve: ['.gitkeep']
                }
            ]
        })
    ]
});
