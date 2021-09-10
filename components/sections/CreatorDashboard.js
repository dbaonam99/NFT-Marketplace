import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import styles from './CreatorDashboard.module.css'
import NftCard from '../elements/NftCard'

import {
  nftMarketAddress, nftAddress
} from '../../config'

import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoading(true) 
  }


  if (loading && !nfts.length) return <p style={{ align: 'center' }}>No assets created</p>
  return <div className={styles.creatorDashboard}>
    <h2 className={styles.title}>Items Created</h2>
    <div>
      {nfts.map((nft, i) => <NftCard key={i} data={nft} />)}
    </div>
    <div>
      {Boolean(sold.length) && <div>
        <h2 className={styles.title}>Items sold</h2>
        <div>{sold.map((nft, i) => <NftCard key={i} data={nft} />)}</div>
      </div>}
    </div>
  </div>;
}