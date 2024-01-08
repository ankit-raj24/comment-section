import React from 'react';
import {ReactComponent as Delete} from './delete.svg';
import styles from './styles.module.css';

function CommentBox({content = '', setReplyToComment = () => {}, handleEdit = () => {}, handleDelete = () => {}}) {
    const handleClick = (obj) => {
        obj = {...obj, commentType: 'reply'}
        handleEdit(obj)
    }

  return (
    <div>
        <div className={styles.container}>
            <div className={styles.sub_container}>
                <div className={styles.name}>{content.name}</div>
                <div className={styles.content}>{content.comment}</div>

                <div className={styles.btn_wrap}>
                    <button type="Reply" className={styles.btn} onClick={() => setReplyToComment(content)}>Reply</button>
                    <button type="Edit" className={styles.btn} onClick={() => handleEdit(content)}>Edit</button>
                </div>
            </div>

            <div className={styles.delete_btn} onClick={() => handleDelete(content?.id)}>
                <Delete  fill="white" width={15} height={15}/>
            </div>
        </div>

        {content?.replyData && content?.replyData?.map((obj) => (
            <div className={styles.container} style={{marginLeft: '100px'}}>
                <div className={styles.sub_container}>
                    <div className={styles.name}>{obj.name}</div>
                    <div className={styles.content}>{obj.comment}</div>

                    <div className={styles.btn_wrap}>
                        <button type="Edit" className={styles.btn} onClick={() => handleClick(obj)}>Edit</button>
                    </div>
                </div>

                <div className={styles.delete_btn} onClick={() => handleDelete(obj?.id)}>
                    <Delete  fill="white" width={15} height={15}/>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CommentBox;
