import sql from 'node-sql-parser'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
import * as codec from '@ipld/dag-cbor'
import { encode as encoder, decode as decoder } from 'multiformats/block'
import { create as createSparseArray, load as loadSparseArray } from 'chunky-trees/sparse-array'
import { create as createDBIndex, load as loadDBIndex } from 'chunky-trees/db-index'

const mf = { codec, hasher }

const encode = value => encoder({ value, ...mf })
const decode = bytes => decoder({ bytes, ...mf })

const immediate = () => new Promise(resolve => setImmediate(resolve))

const getNode = async (cid, get, cache, create) => {
  if (cache.has(cid)) {
    return cache.get(cid)
  }
  const block = await get(cid)
  const node = await create(block)
  cache.set(cid, node)
  return node
}

