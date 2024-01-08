import React from 'react';
import styles from '../styles.module.css';

const CommentForm = ({
    onSubmit,
    buttonText,
    handleSubmit,
    register
  }) => {
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.heading}>
          {buttonText === 'POST' ? 'Comment' : 'Reply'}
        </div>
  
        <div className={styles.sub_container}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            {...register('name')}
            className={styles.input}
            required
          />
          <textarea
            placeholder="Comment"
            name="comment"
            {...register('comment')}
            className={styles.textarea}
            required
          />
        </div>
  
        <div className={styles.btn_wrap}>
          <button type="submit" className={styles.btn}>
            {buttonText}
          </button>
        </div>
      </form>
    );
}

export default CommentForm;