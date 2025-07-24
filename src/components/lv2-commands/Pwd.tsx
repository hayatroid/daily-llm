import { type Component, For, Show } from 'solid-js';
import { Breadcrumbs, type Breadcrumb } from '../../lib/navigation';
import { parseSlug, routeToUrl } from '../../lib/routes';
import Shell from '../lv1-shell/Shell';

export interface PwdProps {
  slug: string;
}

const Pwd: Component<PwdProps> = (props) => {
  const route = () => parseSlug(props.slug);
  const path = () => routeToUrl(route());
  const breadcrumbs = () => Breadcrumbs.create(path());

  return (
    <Shell command="pwd">
      <nav class="flex items-center flex-wrap gap-xs font-mono">
        <For each={breadcrumbs()}>
          {(item: Breadcrumb, index) => (
            <>
              <a
                href={item.href}
                class="path-link transition-colors duration-fast ease-in-out"
              >
                {item.text}
              </a>
              <Show when={index() < breadcrumbs().length - 1}>
                <span class="path-separator">/</span>
              </Show>
            </>
          )}
        </For>
      </nav>
    </Shell>
  );
};

export default Pwd;
