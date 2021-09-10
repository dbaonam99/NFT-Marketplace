import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import styles from "./MyAssets.module.css"

import {
  nftMarketAddress, nftAddress
} from '../../config'

import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import NftCard from '../elements/NftCard'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
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
    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoading(true) 
  }

  if (loading && !nfts.length) return <p style={{ align: 'center' }}>No assets owned</p>
  return (
    <div className={styles.myAssets}>
      <div>
        {
          nfts.map((nft, i) => <NftCard key={i} data={nft} />)
        }
      </div>
    </div>
  )
}