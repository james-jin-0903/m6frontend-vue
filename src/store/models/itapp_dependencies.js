// To parse this data:
//
//   const Dependencies = require("@/store/models/itapp_dependencies");
//
//   const dependencies = Dependencies.toDependencies(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Dependencies JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toDependencies(json) {
  return cast(json, r('Dependencies'))
}

function dependenciesToJson(value) {
  Object.keys(value).forEach(key => {
    if (typeof value[key] === 'object' && value[key] === null) {
      value[key] = {
        id: undefined,
        field: undefined,
        value: undefined
      }
    }
  })
  const response = uncast(JSON.parse(JSON.stringify(value)), r('Dependencies'))
  Object.keys(response).forEach(key => {
    if (typeof response[key] === 'object') response[key] = response[key]['id']
  })
  return response
}

function fromAPI(value) {
  const asa = []
  value.forEach(item => {
    Object.keys(item).forEach(key => {
      if (typeof item[key] === 'object' && item[key] === null) {
        item[key] = { id: undefined, value: undefined, fields: undefined }
      }
    })
    asa.push(cast(item, r('DepFromAPI')))
  })
  return asa
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

  function transformArray(typ, val) {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val)
    return val.map(el => transform(el, typ, getProps))
  }

  function transformEnum(cases, val) {
    if (cases.indexOf(val) !== -1) return val
    return invalidValue(cases, val)
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
    return {}.hasOwnProperty.call(typ, 'unionMembers') ? transformUnion(typ.unionMembers, typeof val === 'object' ? JSON.parse(JSON.stringify(val)) : val)
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
  'DepFromAPI': o([
    {
      json: 'update_install_notes',
      js: 'installNotes',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'app_compliant',
      js: 'appCompliant',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'update_exec_path',
      js: 'execPath',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'dct_status',
      js: 'dctStatus',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'app_build',
      js: 'appBuild',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'eda',
      js: 'edaPackage',
      typ: u(undefined, null, r('AppBuild'))
    },
    { json: 'type', js: 'type', typ: u(undefined, null, r('AppBuild')) },
    { json: 'remediation_date', js: 'remDate', typ: u(undefined, '') },
    { json: 'created_at', js: 'created_at', typ: u(undefined, '') },
    { json: 'updated_at', js: 'updated_at', typ: u(undefined, '') },
    { json: 'status', js: 'status', typ: u(undefined, 0, true) },
    { json: 'version', js: 'version', typ: u(undefined, '') },
    { json: 'app_id', js: 'app_id', typ: u(undefined, 0) },
    { json: 'notes', js: 'notes', typ: u(null, '') },
    { json: 'id', js: 'id', typ: u(undefined, 0) }
  ], false),
  'Dependencies': o([
    {
      json: 'dependency_update_install_notes',
      js: 'installNotes',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'dependency_app_compliant',
      js: 'appCompliant',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'dependency_update_exec_path',
      js: 'execPath',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'dependency_dct_status',
      js: 'dctStatus',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'dependency_app_build',
      js: 'appBuild',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'dependency_eda',
      js: 'edaPackage',
      typ: u(undefined, null, r('AppBuild'))
    },
    {
      json: 'dependency_type',
      js: 'type',
      typ: u(undefined, null, r('AppBuild'))
    },
    { json: 'remediation_date', js: 'remDate', typ: u(undefined, '') },
    { json: 'created_at', js: 'created_at', typ: u(undefined, '') },
    { json: 'updated_at', js: 'updated_at', typ: u(undefined, '') },
    { json: 'status', js: 'status', typ: u(undefined, 0, true) },
    { json: 'version', js: 'version', typ: u(undefined, '') },
    { json: 'app_id', js: 'app_id', typ: u(undefined, 0) },
    { json: 'notes', js: 'notes', typ: u(null, '') },
    { json: 'id', js: 'id', typ: u(undefined, 0) }
  ], false),
  'AppBuild': o([
    { json: 'id', js: 'id', typ: u(0, undefined) },
    { json: 'field', js: 'field', typ: u('', undefined) },
    { json: 'value', js: 'value', typ: u('', undefined) }
  ], false)
}

module.exports = {
  'dependenciesToJson': dependenciesToJson,
  'toDependencies': toDependencies,
  'fromAPI': fromAPI
}
