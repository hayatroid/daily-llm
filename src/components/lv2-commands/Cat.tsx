import { type Component, type JSX, onMount } from 'solid-js';
import Shell from '../lv1-shell/Shell';

export interface CatProps {
  command: string;
  title: string;
  gem?: boolean;
  children?: JSX.Element;
}

const Cat: Component<CatProps> = (props) => {
  onMount(() => {
    // Initialize content anchors for heading navigation
    if (typeof window !== 'undefined') {
      import('../../lib/ui').then(({ ContentAnchors }) => {
        ContentAnchors.init('.file-content');
      });
    }
  });

  return (
    <Shell command={props.command}>
      <div class="file-content ml-0 leading-normal">
        <h1 class="text-normal font-bold m-0 font-mono flex items-baseline">
          {props.title} {props.gem && '💎'}
        </h1>
        {props.children}
      </div>
    </Shell>
  );
};

export default Cat;
