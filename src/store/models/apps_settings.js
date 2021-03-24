// To parse this data:
//
//   const Convert = require("@/store/models/file");
//
//   const appsSettings = Convert.toAppsSettings(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toAppsSettings(json) {
  const settingArray = cast(json, a(r('AppsSettings')))
  settingArray.forEach(((item, index) => {
    settingArray[index] = { id: item.id, value: item.value, field: item.field }
  }))
  return settingArray
}

function appsSettingsToJson(value) {
  return JSON.stringify(uncast(value, a(r('AppsSettings'))), null, 2)
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
  'AppsSettings': o([
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
      json: 'app_type',
      js: 'app_type',
      typ: u(undefined, '')
    },
    {
      json: 'parent_id',
      js: 'parent_id',
      typ: u(undefined, u(null, 0))
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
  'appsSettingsToJson': appsSettingsToJson,
  'toAppsSettings': toAppsSettings
}
