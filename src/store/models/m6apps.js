// To parse this data:
//
//   const Convert = require("@/store/models/m6apps");
//
//   const m6Apps = Convert.toM6Apps(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toM6Apps(json) {
  return cast(json, a(r('M6Apps')))
}

function m6AppsToJson(value) {
  return JSON.stringify(uncast(value, a(r('M6Apps'))), null, 2)
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
  'M6Apps': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'description',
      js: 'description',
      typ: u(undefined, '')
    },
    {
      json: 'app_number',
      js: 'app_number',
      typ: u(undefined, '')
    },
    {
      json: 'iconLink',
      js: 'iconLink',
      typ: u(undefined, '')
    },
    {
      json: 'app_type',
      js: 'app_type',
      typ: u(undefined, '')
    },
    {
      json: 'author',
      js: 'author',
      typ: u(undefined, '')
    },
    {
      json: 'title',
      js: 'title',
      typ: u(undefined, '')
    },
    {
      json: 'image',
      js: 'image',
      typ: u(undefined, u(null, ''))
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
      json: 'prefix',
      js: 'prefix',
      typ: u(undefined, u(null, ''))
    },
    {
      json: 'image_info',
      js: 'image_info',
      typ: u(undefined, r('ImageInfo'))
    },
    {
      json: 'general_info',
      js: 'general_info',
      typ: u(undefined, u(r('GeneralInfo'), null))
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'panel_id',
      js: 'panel_id',
      typ: u(undefined, u(null, 0))
    },
    {
      json: 'record_number',
      js: 'record_number',
      typ: u(undefined, '')
    },
    {
      json: 'status',
      js: 'status',
      typ: u(undefined, '')
    },
    {
      json: 'metadata',
      js: 'metadata',
      typ: u(undefined, '')
    },
    {
      json: 'class',
      js: 'class',
      typ: u(undefined, null)
    },
    {
      json: 'category',
      js: 'category',
      typ: u(undefined, null)
    },
    {
      json: 'type',
      js: 'type',
      typ: u(undefined, null)
    },
    {
      json: 'state',
      js: 'state',
      typ: u(undefined, null)
    },
    {
      json: 'app',
      js: 'app',
      typ: u(undefined, r('App'))
    },
    {
      json: 'app_prefix',
      js: 'app_prefix',
      typ: u(undefined, 'undefined', u(null, ''))
    }
  ], false),
  'App': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_number',
      js: 'app_number',
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
      json: 'iconLink',
      js: 'iconLink',
      typ: u(undefined, '')
    },
    {
      json: 'prefix',
      js: 'prefix',
      typ: u(undefined, '')
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
      typ: u(undefined, r('Category'))
    },
    {
      json: 'first_contact_group',
      js: 'first_contact_group',
      typ: u(undefined, r('Category'))
    },
    {
      json: 'category',
      js: 'category',
      typ: u(undefined, r('Category'))
    },
    {
      json: 'sub_category',
      js: 'sub_category',
      typ: u(undefined, null)
    },
    {
      json: 'type',
      js: 'type',
      typ: u(undefined, r('Category'))
    },
    {
      json: 'app_management',
      js: 'app_management',
      typ: u(undefined, u(r('Category'), null))
    },
    {
      json: 'server_hosting_model',
      js: 'server_hosting_model',
      typ: u(undefined, u(r('Category'), null))
    },
    {
      json: 'capability',
      js: 'capability',
      typ: u(undefined, null)
    }
  ], false),
  'Category': o([
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
      typ: u(undefined, u(null, ''))
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
  ], false)
}

module.exports = {
  'm6AppsToJson': m6AppsToJson,
  'toM6Apps': toM6Apps
}
