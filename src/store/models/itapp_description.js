// To parse this data:
//
//   const Convert = require("@/store/models/itapp_description");
//
//   const itappsDescription = Convert.toItappsDescription(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toItappsDescription(json) {
  const res = cast(json, r('ItappsDescription'))
  Object.keys(res.general_info).forEach(key => {
    if (typeof res.general_info[key] === 'object' && res.general_info[key] === null) {
      res.general_info[key] = {
        id: undefined,
        value: undefined,
        field: undefined
      }
    }
  })
  return res
}

function itappsDescriptionToJson(value) {
  const res = uncast(JSON.parse(JSON.stringify(value)), r('ItappsDescription'))
  res['general_info'] = generalInfo(res.general_info)
  return res
}

function generalInfo(value) {
  const res = uncast(JSON.parse(JSON.stringify(value)), r('GeneralInfotoAPI'))
  Object.keys(res).forEach(key => {
    if (typeof res[key] === 'object') res[key] = res[key]['id']
  })
  return res
}


function invalidValue(typ, val, key = '') {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`)
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`)
}

function jsonToJSProps(typ) {
  if (typ.jsonToJS === undefined) {
    const map = {}
    typ.props.forEach(p => map[p.json] = { key: p.js, typ: p.typ })
    typ.jsonToJS = map
  }
  return typ.jsonToJS
}

function jsToJSONProps(typ) {
  if (typ.jsToJSON === undefined) {
    const map = {}
    typ.props.forEach(p => map[p.js] = { key: p.json, typ: p.typ })
    typ.jsToJSON = map
  }
  return typ.jsToJSON
}

function transform(val, typ, getProps, key = '') {
  function transformPrimitive(typ, val) {
    if (typeof typ === typeof val) return val
    return invalidValue(typ, val, key)
  }

  function transformUnion(typs, val) {
    // val must validate against one typ in typs
    const l = typs.length
    for (let i = 0; i < l; i++) {
      const typ = typs[i]
      try {
        return transform(val, typ, getProps)
      } catch (_) {
        // empty
      }
    }
    return invalidValue(typs, val)
  }

  function transformEnum(cases, val) {
    if (cases.indexOf(val) !== -1) return val
    return invalidValue(cases, val)
  }

  function transformArray(typ, val) {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val)
    return val.map(el => transform(el, typ, getProps))
  }

  function transformDate(val) {
    if (val === null) {
      return null
    }
    const d = new Date(val)
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val)
    }
    return d
  }

  function transformObject(props, additional, val) {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val)
    }
    const result = {}
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key]
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined
      result[prop.key] = transform(v, prop.typ, getProps, prop.key)
    })
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key)
      }
    })
    return result
  }

  if (typ === 'any') return val
  if (typ === null) {
    if (val === null) return val
    return invalidValue(typ, val)
  }
  if (typ === false) return invalidValue(typ, val)
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref]
  }
  if (Array.isArray(typ)) return transformEnum(typ, val)
  if (typeof typ === 'object') {
    return {}.hasOwnProperty.call(typ, 'unionMembers') ? transformUnion(typ.unionMembers, val)
      : {}.hasOwnProperty.call(typ, 'arrayItems') ? transformArray(typ.arrayItems, val)
        : {}.hasOwnProperty.call(typ, 'props') ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val)
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val)
  return transformPrimitive(typ, val)
}

function cast(val, typ) {
  return transform(val, typ, jsonToJSProps)
}

function uncast(val, typ) {
  return transform(val, typ, jsToJSONProps)
}

function a(typ) {
  return { arrayItems: typ }
}

function u(...typs) {
  return { unionMembers: typs }
}

function o(props, additional) {
  return { props, additional }
}

function r(name) {
  return { ref: name }
}

const typeMap = {
  'GeneralInfotoAPI': o([
    {
      json: 'server_hosting_model_settings_id',
      js: 'server_hosting_model',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'first_contact_group_settings_id',
      js: 'first_contact_group',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'app_management_settings_id',
      js: 'app_management',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'sub_category_settings_id',
      js: 'sub_category',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'category_settings_id',
      js: 'category',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'status_settings_id',
      js: 'status',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'type_settings_id',
      js: 'type',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'capability',
      js: 'capability',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    },
    {
      json: 'vendor_id',
      js: 'vendor_id',
      typ: u(undefined, '')
    },
    {
      json: 'version',
      js: 'version',
      typ: u(undefined, '')
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    }
  ], false),
  'ItappsDescription': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_number',
      js: 'app_number',
      typ: u(undefined, '')
    },
    {
      json: 'layout_type',
      js: 'layout_type',
      typ: u(undefined, u(null, ''))
    },
    {
      json: 'metadata',
      js: 'metadata',
      typ: u(undefined, u(null, ''))
    },
    {
      json: 'app_type',
      js: 'app_type',
      typ: u(undefined, '')
    },
    {
      json: 'title',
      js: 'title',
      typ: u(undefined, '')
    },
    {
      json: 'author',
      js: 'author',
      typ: u(undefined, '')
    },
    {
      json: 'iconLink',
      js: 'iconLink',
      typ: u(undefined, '')
    },
    {
      json: 'prefix',
      js: 'prefix',
      typ: u(undefined, u(null, ''))
    },
    {
      json: 'description',
      js: 'description',
      typ: u(undefined, '')
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    },
    {
      json: 'general_info',
      js: 'general_info',
      typ: u(null, u(r('GeneralInfo'), r('abc')))
    },
    {
      json: 'information_security',
      js: 'information_security',
      typ: u(undefined, r('InformationSecurity'))
    },
    {
      json: 'image_info',
      js: 'image_info',
      typ: u(undefined, r('ImageInfo'))
    },
    {
      json: 'also_known',
      js: 'also_known',
      typ: u(undefined, '', a(u(null, r('Known'))))
    },
    {
      json: 'tags',
      js: 'tags',
      typ: u(undefined, a(u(null, r('Known'))))
    },
    {
      json: 'formerly_known',
      js: 'formerly_known',
      typ: u(undefined, '', a(u(null, r('Known'))))
    }
  ], false),
  'abc': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'vendor_id',
      js: 'vendor_id',
      typ: u(undefined, '')
    },
    {
      json: 'version',
      js: 'version',
      typ: u(undefined, '')
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    },
    {
      json: 'status',
      js: 'status',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'first_contact_group',
      js: 'first_contact_group',
      typ: u(undefined, r('AppManagement'))
    },
    {
      json: 'category',
      js: 'category',
      typ: u(undefined, u(null, r('AppManagement')))
    },
    {
      json: 'sub_category',
      js: 'sub_category',
      typ: u(undefined, u(null, r('AppManagement')))
    },
    {
      json: 'type',
      js: 'type',
      typ: u(undefined, u(null, r('AppManagement')))
    },
    {
      json: 'app_management',
      js: 'app_management',
      typ: u(undefined, u(null, r('AppManagement')))
    },
    {
      json: 'server_hosting_model',
      js: 'server_hosting_model',
      typ: u(undefined, u(null, r('AppManagement')))
    },
    {
      json: 'capability',
      js: 'capability',
      typ: u(undefined, u(null, r('AppManagement')))
    }
  ]),
  'Known': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'field',
      js: 'field',
      typ: u(undefined, '')
    },
    {
      json: 'value',
      js: 'value',
      typ: u(undefined, '')
    },
    {
      json: 'foreign_id',
      js: 'foreign_id',
      typ: u(undefined, 0)
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    }
  ], false),
  'GeneralInfo': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'vendor_id',
      js: 'vendor_id',
      typ: u(undefined, '')
    },
    {
      json: 'version',
      js: 'version',
      typ: u(undefined, '')
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    },
    {
      json: 'status',
      js: 'status',
      typ: u(undefined, u(null, u(r('AppManagement'), 0)))
    },
    {
      json: 'first_contact_group',
      js: 'first_contact_group',
      typ: u(undefined, u(null, u(r('AppManagement'), 0)))
    },
    {
      json: 'category',
      js: 'category',
      typ: u(undefined, u(null, u(r('AppManagement'), 0)))
    },
    {
      json: 'sub_category',
      js: 'sub_category',
      typ: u(undefined, u(null, u(r('AppManagement'), 0)))
    },
    {
      json: 'type',
      js: 'type',
      typ: u(undefined, u(null, u(r('AppManagement'), 0)))
    },
    {
      json: 'app_management',
      js: 'app_management',
      typ: u(undefined, u(null, u(r('AppManagement'), 0)))
    },
    {
      json: 'server_hosting_model',
      js: 'server_hosting_model',
      typ: u(undefined, u(null, u(r('AppManagement'), 0)))
    },
    {
      json: 'capability',
      js: 'capability',
      typ: u(undefined, u(null, u(r('AppManagement'), 0)))
    }
  ], false),
  'AppManagement': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'value',
      js: 'value',
      typ: u(undefined, '')
    },
    {
      json: 'field',
      js: 'field',
      typ: u(undefined, '')
    }
  ], false),
  'ImageInfo': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'image_url',
      js: 'image_url',
      typ: u(null, '')
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    }
  ], false),
  'InformationSecurity': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'facing',
      js: 'facing',
      typ: u(undefined, 0, true)
    },
    {
      json: 'phi',
      js: 'phi',
      typ: u(undefined, 0, true)
    },
    {
      json: 'pci',
      js: 'pci',
      typ: u(undefined, 0, true)
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    },
    {
      json: 'ssn_foreign',
      js: 'ssn_foreign',
      typ: u(undefined, r('AppManagement'))
    }
  ], false)
}

module.exports = {
  'itappsDescriptionToJson': itappsDescriptionToJson,
  'toItappsDescription': toItappsDescription,
  'generalInfo': generalInfo
}
