import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { keypairIdentity, Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState(null)
  const { connection } = useConnection()
  const wallet = useWallet()

  const metaplex = Metaplex.make(connection)
  .use(walletAdapterIdentity(wallet))
  
  const fetchNfts = async () => {
    if(!wallet.connected) {
      return
    }
    const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey }).run()
    
    let nftData = []

    for(let index = 0; index < nfts.length; index++) {
      let fetchResult = await fetch(nfts[index].uri)
      let json = await fetchResult.json()
      nftData.push(json)
    }

    setNftData(nftData)
    
  }

  useEffect(() => {
    fetchNfts()
  }, [wallet])

  return (
    <div>{nftData && (
      <div className={styles.gridNFT}>
        {nftData.map((nft, i) => (
          <div key={i}>
            <ul>{nft.name}</ul>
            <img src={nft.image} />
          </div>
        ))}
      </div>
    )}
    </div>
  )
}
