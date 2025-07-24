import { type Component, type JSX } from 'solid-js';
import Prompt from '../lv0-atoms/Prompt';

export interface ShellProps {
  command: string;
  children?: JSX.Element;
}

const Shell: Component<ShellProps> = (props) => {
  return (
    <div class="font-mono mt-section mb-lg flex flex-col gap-sm">
      <Prompt command={props.command} />
      <div class="session-content">{props.children}</div>
    </div>
  );
};

export default Shell;
