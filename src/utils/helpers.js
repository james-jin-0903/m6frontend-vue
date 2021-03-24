import { isObject } from 'lodash'
import { db } from '@/utils/Firebase'

function dataGet(source, path = '', dfl = null) {
  return path
    .split('.')
    .reduce(
      (previous, current) =>
        isObject(previous) ? previous[current] : previous,
      source
    ) || dfl
}

function ffGetRef(...segments) {
  segments = segments.flat()

  if (segments.length) {
    let result = db
    segments.map((segment, index) => {
      result = index % 2 === 0 ? result.collection(segment) : result.doc(segment)
    })
    return result
  } else {
    return ''
  }
}

async function ffGetDocs({ options = {}, collectionRef} = null) {
  try {
    let response = []
    
    if(collectionRef) {
      let { where, orderBy, limit } = options
      if (where) {
        if (where[0] instanceof Array) {
          // It's an array of array
          for (let w of where) {
            collectionRef = collectionRef.where(...w)
          }
        } else {
          collectionRef = collectionRef.where(...where)
        }
  
      }
  
      if (orderBy) {
        collectionRef = collectionRef.orderBy(...orderBy)
      }
  
      if (limit) {
        collectionRef = collectionRef.limit(limit)
      }
    
      const snapshot = await collectionRef.get()
      
      if(!snapshot.empty) {
        response = await Promise.all(snapshot.docs.map((doc => {
          let item = {
            ...doc.data(),
            id: doc.id,
            ref: doc.ref
          }
          
          return item
        })))
      }
    }
    
    return response
  } catch (e) {
    throw new Error(e)
  }
}

const install = Vue => {
  Vue.prototype.$h = {
    dg: dataGet,
    ffGetRef: ffGetRef,
    ffGetDocs: ffGetDocs
  }
}

export { dataGet, ffGetDocs }

export default install
