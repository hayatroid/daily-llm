// File system abstractions for path-based component architecture
import type { FrontmatterData } from './types';

export interface FileSystem {
  read(path: string): Content | null;
  list(path: string): string[];
  tree(path: string): TreeNode[];
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: TreeNode[];
  metadata?: FrontmatterData;
}

export interface Content {
  metadata: FrontmatterData;
  Component?: any; // Astro component
}

// File type checking utilities
export function isConversationFile(filePath: string): boolean {
  return filePath.endsWith('.md') && !filePath.endsWith('index.md');
}

export function extractDateFromPath(filePath: string): string {
  const pathParts = filePath.split('/');
  return pathParts[pathParts.length - 2] || '';
}

export class VirtualFS implements FileSystem {
  private content: Map<string, any> = new Map();

  constructor(allContent: any[]) {
    // Initialize with existing content structure
    this.buildContentMap(allContent);
  }

  read(path: string): Content | null {
    // If directory, return its index.md
    if (path.endsWith('/')) {
      return this.read(path + 'index.md');
    }

    return this.content.get(path) || null;
  }

  list(path: string): string[] {
    // Return entries in directory
    const entries = [...this.content.keys()]
      .filter((p) => p.startsWith(path) && p !== path)
      .map((p) => p.slice(path.length).split('/')[0])
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i); // unique

    return entries.sort();
  }

  tree(path: string): TreeNode[] {
    const normalizedPath = path.endsWith('/') ? path : path + '/';
    const entries = new Map<string, TreeNode>();

    // Build tree structure from all paths
    [...this.content.keys()]
      .filter(
        (p) => p.startsWith(normalizedPath) && p !== normalizedPath.slice(0, -1)
      )
      .forEach((fullPath) => {
        const relativePath = fullPath.slice(normalizedPath.length);
        const pathParts = relativePath.split('/').filter(Boolean);

        this.buildTreeNode(entries, pathParts, fullPath, normalizedPath);
      });

    return Array.from(entries.values()).sort((a, b) => {
      // Directories first, then files, both alphabetically
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  private buildTreeNode(
    entries: Map<string, TreeNode>,
    pathParts: string[],
    fullPath: string,
    basePath: string
  ): void {
    const [currentPart, ...restParts] = pathParts;
    const currentPath = basePath + currentPart;

    if (!entries.has(currentPart)) {
      const isDirectory = restParts.length > 0;
      const node: TreeNode = {
        name: currentPart,
        path: currentPath,
        type: isDirectory ? 'directory' : 'file',
        children: isDirectory ? [] : undefined,
        metadata: isDirectory
          ? undefined
          : this.content.get(fullPath)?.metadata,
      };
      entries.set(currentPart, node);
    }

    if (restParts.length > 0) {
      const node = entries.get(currentPart)!;
      if (node.children) {
        const childEntries = new Map<string, TreeNode>();
        node.children.forEach((child) => childEntries.set(child.name, child));

        this.buildTreeNode(
          childEntries,
          restParts,
          fullPath,
          currentPath + '/'
        );

        node.children = Array.from(childEntries.values()).sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
      }
    }
  }

  private buildContentMap(allContent: any[]): void {
    for (const file of allContent) {
      const virtualPath = this.getVirtualPath(file.file);

      this.content.set(virtualPath, {
        metadata: file.frontmatter || {},
        Component: file.default,
      });
    }
  }

  private getVirtualPath(filePath: string): string {
    // Convert content/2024-01-15/001-astro-setup.md -> /2024-01-15/001-astro-setup.md
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const dateDir = pathParts[pathParts.length - 2];

    return `/${dateDir}/${fileName}`;
  }
}
