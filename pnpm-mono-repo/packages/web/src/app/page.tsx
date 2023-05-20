import Image from 'next/image'
import styles from './page.module.css'
import { Button } from '@pnpm-test/core'
export default function Home() {
  return (
    <main className={styles.main}>
      <Button/>
    </main>
  )
}
