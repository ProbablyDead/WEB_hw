import React from "react";
import styles from "./FieldCell.module.css";

interface FieldButtonProps {
  char: string;
  onClick: () => void;
  disabled: boolean;
};

const FieldButton: React.FC<FieldButtonProps> = ({char, onClick, disabled}) => {
  return (
    <button className={styles.cell} onClick={onClick} disabled={disabled}>
      {char}
    </button>
  );
};

export default FieldButton;
