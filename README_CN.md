# vite-plugin-deploy-copy

[🇺🇸 English](./README.md) | [🇨🇳 中文文档](./README_CN.md)

一个用于将构建产物（Build Artifacts）安全复制到部署目录的 Vite 插件。
通常用于前端项目作为大型 Monorepo 或后端框架（如 Laravel, Rails, Django）的一部分时，需要将构建好的静态资源自动同步到 Vite 根目录之外的公共目录。

## 特性

- 🚀 **类型安全**：完全支持 TypeScript。
- 🛡️ **安全复制**：自动检查源目录是否存在，并在复制前安全清理目标目录。
- ♻️ **文件保留**：支持在清理目标目录时保留特定文件/文件夹（例如 `.git`, `.gitignore`）。
- ⚡ **自动触发**：在构建完成后的 `closeBundle` 钩子中自动运行。

## 安装

```bash
npm install vite-plugin-deploy-copy --save-dev
# or
yarn add vite-plugin-deploy-copy -D
# or
pnpm add vite-plugin-deploy-copy -D
```

## 使用方法

在 `vite.config.ts` 中注册插件：

```typescript
import { defineConfig } from 'vite';
import deployCopy from 'vite-plugin-deploy-copy';

export default defineConfig({
  plugins: [
    deployCopy({
      targets: [
        {
          // 源目录 (通常是 dist 文件夹)
          src: 'dist', 
          // 目标目录
          dest: '../public/assets', 
          // 可选：在目标目录中需要保留的文件/文件夹
          preserve: ['.git', '.gitignore'] 
        }
      ]
    })
  ]
});
```

## 配置项

### `PluginOptions`

| 选项 | 类型 | 描述 |
|---|---|---|
| `targets` | `Target[]` | 复制目标数组。 |

### `Target` 接口

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `src` | `string` | **必填** | 源目录路径（相对 `process.cwd()` 或绝对路径）。 |
| `dest` | `string` | **必填** | 目标目录路径（相对 `process.cwd()` 或绝对路径）。 |
| `preserve` | `string[]` | `[]` | 在清理目标目录时需要保留的文件名或文件夹名列表。 |

## 许可证

MIT
