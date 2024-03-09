import React from 'react';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
  message: string;
  backOnClick: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({message, backOnClick}) => {
  return (
    <div className={styles.error}> 
      <div>{message}</div>
      <button onClick={backOnClick}> Back </button>
    </div>
  );
};

export default ErrorPage;
