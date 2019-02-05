import bs58 from 'bs58';
const { utils } = require('web3');

export const mhashIntoBytes32 = (mhash: string): MhashObject => {
  const decoded = Buffer.from(bs58.decode(mhash));

  return {
    digest: `0x${decoded.slice(2).toString('hex')}`,
    hashFunction: decoded[0],
    size: decoded[1],
  };
};

type MhashObject = {
  digest: string,
  hashFunction: any,
  size: any,
}

// hashfunction - 18, size - 32
export const b32IntoMhash = (obj: MhashObject) => {
  const { digest, hashFunction, size } = obj;
  if (size === 0) return null;

  const hashBytes = Buffer.from(digest.slice(2), 'hex');

  const multihashBytes = new hashBytes.constructor(2 + hashBytes.length);
  multihashBytes[0] = hashFunction;
  multihashBytes[1] = size;
  multihashBytes.set(hashBytes, 2);

  return bs58.encode(multihashBytes);
};

type Service = {
  name: string,
  description: string,
}

export type AccountData = {
  bio: string,
  location: string,
  pic: string,
  services?: Map<number, Service>,
}
