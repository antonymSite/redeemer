import { MongoClient, ServerApiVersion } from "mongodb";
import { ethers } from "ethers";
import { abi } from "../contracts/antonym_abi.json";

const https = require("https");

const URI = process.env.VITE_MONGODB_URL;
const dbName = process.env.VITE_MONGODB_NAME;
const scAddress = process.env.VITE_CONTRACT_ADDRESS;

const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


const useCollection = async (collectionName) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return collection
}

export const getTokens = async (filter) => {
  const tokens = await useCollection("tokens");
  const document = await tokens.find(filter).toArray();
  await client.close();
  return document;
};

export const listRedeemedTokens = async () => {
  const collection = await useCollection("tokens");
  const arr = await collection.find({ redeemed: true }).toArray();
  await client.close();
  const ids = arr.map(doc => doc.tokenID)
  return ids;
}

export const find = async (tokenID) => {
  const collection = await useCollection("tokens");
  let document = null
  // let document = await collection.findOne({ tokenID: tokenID });
  if (!document) {
    document = await fetchNftById(tokenID);
  }
  return document;
};

export const findOrFetch = async (tokenuri, ownerAddress) => {
  const nftID = tokenuri.substring(tokenuri.lastIndexOf("/") + 1);
  const collection = await useCollection("tokens");
  const document = await collection.findOne({ tokenID: nftID });
  if (document == null) {
    try {
      const nftmeta = await fetchNft(tokenuri);

      const nftObj = JSON.parse(nftmeta);
      collection.insertOne({ ...nftObj, tokenID: nftID, owner: ownerAddress });
      return JSON.stringify(nftObj);
    } catch (error) {
      return JSON.stringify(error);
    }
  }
  return document;
};

export const updateTokens = async (filter, data) => {
  const collection = await useCollection("tokens");
  await collection.updateMany(filter, data);
  await client.close();
  return true;
};

export const updateToken = async (tokenID, _data) => {
  const collection = await useCollection("tokens");
  await collection.updateOne({ tokenID }, { $set: { ..._data } });
  await client.close();
  return true;
};

export const refreshMeta = async (tokenID) => {
  https.get(
    `https://api.opensea.io/api/v1/asset/${scAddress}/${tokenID}/?force_update=true`,{
      headers: {
        'X-API-KEY': process.env.OPENSEA_API_KEY
      }
    }
  );
};

export const getTokenOwner = async (tokenID) => {
  const provider = new ethers.providers.InfuraProvider(
    process.env.VITE_CHAIN_NETWORK,
    process.env.VITE_INFURA_PROJECT
  );

  const contract = new ethers.Contract(
    process.env.VITE_CONTRACT_ADDRESS,
    abi,
    provider
  );
  return await contract.ownerOf(tokenID);
};

const fetchNft = async (tokenuri) => {
  const httpRequest = (url) => {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          res.setEncoding("utf8");
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve(body));
        })
        .on("error", reject);
    });
  };
  return await httpRequest(tokenuri);
};

export const fetchNftById = async (tokenId) => {
  const httpRequest = (url) => {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          res.setEncoding("utf8");
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve(body));
        })
        .on("error", reject);
    });
  };
  const text = await httpRequest(
    "https://antonymnft.s3.us-west-1.amazonaws.com/json/" + tokenId
  );
  return JSON.parse(text);
};

export const findToken = async (tokenID) => {
  const collection = await useCollection("tokens");
  const document = await collection.findOne({ tokenID });
  return document;
};