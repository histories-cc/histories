// add gateway to IPFS CID

const UrlPrefix =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? 'https://ipfs.infura.io/ipfs/';

export default UrlPrefix;
