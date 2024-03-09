import React from 'react'
import styles from './MenuButton.module.css'

interface MenuButtonPrors {
  title: string;
  onClick: () => void
}

const MenuButton: React.FC<MenuButtonPrors> = ({ title, onClick }) => {
  return <button className={styles.menuButton} onClick={onClick}>{ title }</button>;
};

export default MenuButton;
