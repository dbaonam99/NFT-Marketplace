import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from "web3modal"
import axios from 'axios';
import NftCard from '../elements/NftCard'
import { nftAddress, nftMarketAddress } from '../../config';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import styles from './ItemList.module.css';

function ItemList() {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState()

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();

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
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoading(true) 
  }
  
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  if (loading && !nfts.length) return <p style={{ align: 'center' }}>No items in marketplace</p>
  return <div className={styles.itemList}>
    {nfts.map((nft, i) => <NftCard key={i} data={nft} onClick={() => buyNft(nft)} />)}
  </div>
}

export default ItemList;