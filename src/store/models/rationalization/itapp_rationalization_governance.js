// To parse this data:
//
//   const Convert = require("@/store/models/rationalization/itapp_rationalization_governance");
//
//   const rationalizationGovernance = Convert.toRationalizationGovernance(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toRationalizationGovernance(json) {
  return cast(json, a(r('RationalizationGovernance')))
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
    if (Object.keys(result).length === 3) {
      return result.id
    }
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
  'RationalizationGovernance': o([
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
      json: 'estimated_days_to_replace',
      js: 'estimated_days_to_replace',
      typ: u(undefined, '')
    },
    {
      json: 'primary_customer_group',
      js: 'primary_customer_group',
      typ: u(undefined, '')
    },
    {
      json: 'responsible_manager',
      js: 'responsible_manager',
      typ: u(undefined, '')
    },
    {
      json: 'responsible_vp_dir',
      js: 'responsible_vp_dir',
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
      json: 'responsible_committee',
      js: 'responsible_committee',
      typ: u(undefined, r('ItAppSetting'))
    },
    {
      json: 'responsible_division',
      js: 'responsible_division',
      typ: u(undefined, r('ItAppSetting'))
    },
    {
      json: 'first_contact_group',
      js: 'first_contact_group',
      typ: u(undefined, r('ItAppSetting'))
    }
  ], false),
  'ItAppSetting': o([
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
  ], false)
}

module.exports = {
  'toRationalizationGovernance': toRationalizationGovernance
}
