import { type Component, For } from 'solid-js';
import type { TreeNode } from '../../lib/navigation';
import Shell from '../lv1-shell/Shell';

export interface TreeProps {
  nodes: TreeNode[];
}

const Tree: Component<TreeProps> = (props) => {
  return (
    <Shell command="tree">
      <div class="font-mono text-normal leading-tight">
        <For each={props.nodes}>
          {(item: TreeNode) => (
            <div
              class="tree-item flex items-baseline gap-default mb-[calc((1.6-1)*var(--space-md)/2)]"
              data-level={item.level}
              style={{
                'margin-left': `calc(${item.level} * var(--tree-indent))`,
              }}
            >
              <a href={item.href} class="tree-link" data-gem={item.gem}>
                {item.text}
              </a>
            </div>
          )}
        </For>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .tree-item[data-level="1"],
          .tree-item[data-level="2"],
          .tree-item[data-level="3"] {
            flex-direction: column;
            gap: var(--space-xs);
          }
        }
      `}</style>
    </Shell>
  );
};

export default Tree;
