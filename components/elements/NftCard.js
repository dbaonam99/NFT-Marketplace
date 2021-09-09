import React from 'react'
import styles from './NftCard.module.css'

function NftCard({ data, onClick }) {
  return <div className={styles.nftCard}>
    <img src={data.image} alt="" />
    <div className={styles.top}>
      <p className={styles.name}>{data.name}</p>
      <div className={styles.desc}>
        <p>{data.description}</p>
      </div>
    </div>
    <div className={styles.bottom}>
      <p className={styles.price}>{data.price} ETH</p>
      <button className={styles.button} onClick={() => onClick(data)}>Buy</button>
    </div>
  </div>;
};

export default NftCard;