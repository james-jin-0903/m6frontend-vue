/* eslint-disable camelcase */
import { db } from '@/utils/Firebase'
import store from '@/store'

const user = store.getters['Auth/getUser']

const settings = [
  {
    name: 'budgets',
    collections: [
      {
        name: 'budget_categories',
        documents: [
          {
            fields: [
              {
                name: 'code',
                value: 'DC'
              },
              {
                name: 'contingency',
                value: false
              },
              {
                name: 'index',
                value: 0
              },
              {
                name: 'name',
                value: 'Default Category'
              },
              {
                name: 'children',
                value: []
              }
            ]
          }
        ]
      }
    ],
    fields: [
      {
        name: 'lineItemsTypes',
        value: ['Default Line Item Type']
      },
      {
        name: 'status',
        value: ['Default Status']
      },
      {
        name: 'types',
        value: ['Default Type']
      },
      {
        name: 'costCodes',
        value: [
          {
            cat_1: [],
            code: '00',
            name: 'New cost code'
          }
        ]
      }

    ]
  },
  {
    name: 'changes',
    fields: [
      {
        name: 'types',
        value: []
      }
    ]
  },
  {
    name: 'commitments',
    fields: [
      {
        name: 'status',
        value: ['Default Status']
      },
      {
        name: 'types',
        value: ['Default Type']
      }
    ]
  },
  {
    name: 'projects',
    fields: [
      {
        name: 'campus',
        value:
          [
            {
              abbr: 'DFC',
              address: '',
              entityName: '',
              id: '',
              latitude: '',
              logo: {
                file: '',
                name: '',
                path: '',
                size: '',
                url: ''
              },
              longitude: '',
              lvl_1: [],
              name: 'Default Campus'
            }
          ]
      },
      {
        name: 'capitalType',
        value: ['Default Capital Type']
      },
      {
        name: 'status',
        value: ['Default Status']
      }
    ]
  },
  {
    name: 'roles',
    fields: [
      {
        name: 'roles',
        value: []
      }
    ]
  },
  {
    name: 'task_status',
    fields: [
      {
        name: 'status',
        value: []
      }
    ]
  },
  {
    name: 'users',
    fields: [
      {
        name: 'budgetApprover',
        value: []
      },
      {
        name: 'projectManager',
        value: [
          {
            email: user.email,
            label: user.firstName + ' ' + user.lastName,
            value: user.id
          }
        ]
      }
    ]
  }
]


async function init($companyID) {
  if ($companyID) {
    const mainRef = db.collection('settings').doc($companyID).collection('settings')
    const snapshot = await mainRef.get()
    if (snapshot.empty) {
      settings.forEach(item => {
        const docRef = mainRef.doc(item.name)
        addFields(docRef, item.fields)

        if (item.collections) {
          addCollection(docRef, item)
        }
      })
    }
  }
}

function addFields(ref, fields) {
  const newFields = {}
  fields.forEach(field => {
    newFields[field.name] = field.value
  })
  ref.set(newFields)
}

function addCollection(ref, item) {
  item.collections.forEach(collection => {
    const collectionRef = ref.collection(collection.name)
    collection.documents.forEach(document => {
      const nFields = {}
      document.fields.forEach(dFields => {
        nFields[dFields.name] = dFields.value
      })
      collectionRef.add(nFields)
    })
  })
}

export default init
