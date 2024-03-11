import MenuButton from "./MenuButton/MenuButton";
import styles from './Menu.module.css'

// export default function Menu (inputs: { title1: string, onClick1: () => void, 
export default function Menu (inputs: {buttons: {title: string, onClick: () => void}[]}) {
  const buttons = [];

  let i = 0;

  for (const button of inputs.buttons) {
    buttons.push(<MenuButton key={i++} title={button.title} onClick={button.onClick}/>);
  }

  return <div className={styles.menu}>{buttons}</div>
};
