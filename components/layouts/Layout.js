import React from 'react';
import Link from 'next/link';
import styles from './Layout.module.css';

function Layout({ children }) {
  return <div>
    <nav className={styles.header}>
      <p className={styles.title}>Metaverse Marketplace</p>
      <div className={styles.navbar}>
        <Link href="/">
          <a className={styles.navbarItem}>
            Home
          </a>
        </Link>
        <Link href="/create-item">
          <a className={styles.navbarItem}>
            Sell Digital Asset
          </a>
        </Link>
        <Link href="/my-assets">
          <a className={styles.navbarItem}>
            My Digital Assets
          </a>
        </Link>
        <Link href="/creator-dashboard">
          <a className={styles.navbarItem}>
            Creator Dashboard
          </a>
        </Link>
      </div>
    </nav>
    {children}
  </div>
}

export default Layout;