import { type Component, Show } from 'solid-js';

export interface PromptProps {
  command: string;
  clickable?: boolean;
  href?: string;
}

const Prompt: Component<PromptProps> = (props) => {
  return (
    <div class="font-mono flex items-center gap-char">
      <span class="text-term-green no-underline">$</span>
      <Show
        when={props.clickable && props.href}
        fallback={
          <span class="font-mono text-term-green no-underline">
            {props.command}
          </span>
        }
      >
        <a
          href={props.href}
          class="font-mono text-term-green no-underline after:content-['█'] after:animate-blink after:text-term-green after:ml-[0.2ch]"
        >
          {props.command}
        </a>
      </Show>
    </div>
  );
};

export default Prompt;
